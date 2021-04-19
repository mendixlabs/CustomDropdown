import { useState, createElement, ReactElement, useEffect } from "react";
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable';
import { Styles } from 'react-select/src/styles';
import { OptionTypeBase } from "react-select/src/types";

import { ListValue, EditableValue, ActionValue, ListAttributeValue } from "mendix";
import Label from './Label';

export interface Option {
    label: JSX.Element;
    value: string;
    secondLabel: string;
    url: string;
}

export interface CustomDropdownComponentProps {
    defaultValue: ListValue;
    firstLabel: ListAttributeValue<string>;
    secondLabel: ListAttributeValue<string>;
    objId: ListAttributeValue<string | BigJs.Big>;
    imgUrl: ListAttributeValue<string>;
    options: ListValue;
    contextObjLabel: EditableValue<string>;
    contextObjId: EditableValue<string | BigJs.Big>;
    selectOption?: ActionValue;
    enableCreate: boolean;
    createValue?: ActionValue;
    enableClear: boolean;
    clearValue?: ActionValue;
    enableSearch: boolean;
    useAvatar: boolean;
    useDefaultStyle: boolean;
    placeholder: string;
    className: string;
    classNamePrefix: string;
    menuHeight: number;
    onFocus?: ActionValue;
}

export default function CustomDropdownComp(props: CustomDropdownComponentProps): ReactElement {
    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState<Option[]>([]);
    const [value, setValue] = useState<Option>();

    const createOption = (label: string, secondaryLabel: string, id: string, urlstring: string) => ({
        label: <Label
            DisplayName={label}
            UrlString={urlstring}
            ClassNamePrefix={props.classNamePrefix}
            EnableAvatar={props.useAvatar}
            SecondLabel={secondaryLabel}
        />,
        value: label,
        id: id,
        secondLabel: secondaryLabel,
        url: urlstring
    });

    useEffect(() => {
        try {
            if (props.defaultValue.status === 'available') {
                const defaultValue = props.defaultValue.items.map(obj => {
                    let { firstLabel, secondLabel, id, imgUrl }: { firstLabel: string; secondLabel: string; id: string; imgUrl: string; } = getLabelValues(obj);
                    return createOption(firstLabel, secondLabel, id, imgUrl);
                })
                setValue(defaultValue[0]);
            }
        }
        catch {
            setValue(null);
        }
    }, [props.defaultValue]);

    useEffect(() => {
        if (props.options.status === 'available') {
            const options = props.options.items.map(obj => {
                let { firstLabel, secondLabel, id, imgUrl }: { firstLabel: string; secondLabel: string; id: string; imgUrl: string; } = getLabelValues(obj);
                return createOption(firstLabel, secondLabel, id, imgUrl);
            })
            setOptions(options);
        }
    }, [props.options]);

    const handleChange = (inputValue: any, actionMeta: any) => {
        switch (actionMeta.action) {
            case 'select-option': {
                selectAction(inputValue);
                break;
            }
            case 'create-option': {
                createAction(inputValue);
                break;
            }
            case 'clear': {
                clearAction(actionMeta);
                break;
            }
        }
    };

    const handleFocus = () => {
        if (props.onFocus != undefined && props.onFocus.canExecute) {
            props.onFocus.execute();
        }
    }

    let styles: Styles<OptionTypeBase, true> = {};
    if (!props.useDefaultStyle) {
        styles = {
            clearIndicator: () => ({}),
            container: () => ({}),
            control: () => ({}),
            dropdownIndicator: () => ({}),
            group: () => ({}),
            groupHeading: () => ({}),
            indicatorsContainer: () => ({}),
            indicatorSeparator: () => ({}),
            input: () => ({}),
            loadingIndicator: () => ({}),
            loadingMessage: () => ({}),
            menu: () => ({}),
            menuList: () => ({}),
            menuPortal: () => ({}),
            multiValue: () => ({}),
            multiValueLabel: () => ({}),
            multiValueRemove: () => ({}),
            noOptionsMessage: () => ({}),
            option: () => ({}),
            placeholder: () => ({}),
            singleValue: () => ({}),
            valueContainer: () => ({}),
        };
    }
    if (props.enableCreate) {
        return (
            <CreatableSelect
                options={options}
                value={value}
                onChange={handleChange}
                isLoading={isLoading}
                isClearable={props.enableClear}
                isSearchable={props.enableSearch}
                styles={styles}
                placeholder={props.placeholder}
                className={props.className!}
                classNamePrefix={props.classNamePrefix}
                maxMenuHeight={props.menuHeight}
                onFocus={handleFocus}
            />
        )
    }
    return (
        <Select
            options={options}
            value={value}
            onChange={handleChange}
            isLoading={isLoading}
            isClearable={props.enableClear}
            isSearchable={props.enableSearch}
            styles={styles}
            placeholder={props.placeholder}
            className={props.className!}
            classNamePrefix={props.classNamePrefix}
            maxMenuHeight={props.menuHeight}
            onFocus={handleFocus}
        />
    )

    function clearAction(actionMeta: any) {
        setIsLoading(true);
        try {
            if (props.contextObjLabel.status === 'available') {
                props.contextObjLabel.setValue(actionMeta.removedValues[0].value);
            }
            if (props.contextObjId.status === 'available') {
                props.contextObjId.setValue('');
            }
            if (props.clearValue.canExecute) {
                props.clearValue.execute();
            }
            setValue(null);
        } catch (err) {
            console.error('Failed to clear a Tag: ' + err);
        }
        setIsLoading(false);
    }

    function createAction(inputValue: any) {
        setIsLoading(true);
        try {
            if (props.contextObjLabel.status === 'available') {
                props.contextObjLabel.setValue(inputValue.value);
            }
            if (props.contextObjId.status === 'available') {
                props.contextObjId.setValue('');
            }
            if (props.createValue.canExecute) {
                props.createValue.execute();
            }
        } catch (err) {
            console.error('Failed to create a Tag: ' + err);
        }
        setIsLoading(false);
    }

    function selectAction(inputValue: any) {
        setIsLoading(true);
        try {
            if (props.contextObjLabel.status === 'available') {
                props.contextObjLabel.setValue(inputValue.value);
            }
            if (props.contextObjId.status === 'available') {
                props.contextObjId.setValue(inputValue.id);
            }
            if (props.selectOption.canExecute) {
                props.selectOption.execute();
            }
            setValue(createOption(inputValue.value, inputValue.secondLabel, inputValue.id, inputValue.url));
        } catch (err) {
            console.error('Failed to select a Tag: ' + err);
        }
        setIsLoading(false);
    }

    function getLabelValues(obj) {
        let firstLabel: string = props.firstLabel != undefined ? props.firstLabel(obj).displayValue : '';
        let secondLabel: string = props.secondLabel != undefined ? props.secondLabel(obj).displayValue : '';
        let id: string = props.objId != undefined ? props.objId(obj).displayValue : '';
        let imgUrl: string = props.imgUrl != undefined ? props.imgUrl(obj).displayValue : '';
        return { firstLabel, secondLabel, id, imgUrl };
    }
}