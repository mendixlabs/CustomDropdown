import { useState, createElement, ReactElement, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { Styles } from "react-select/src/styles";
import { OptionTypeBase } from "react-select/src/types";

import { ListValue, EditableValue, ActionValue, ListAttributeValue } from "mendix";
import Label, { getStyles as getLabelStyles } from "./Label";

export interface Option {
    label: JSX.Element;
    value: string;
    secondLabel: string;
    url: string;
}
// REFACTOR: check if is loading property is available for mendix components
export interface CustomDropdownComponentProps {
    defaultValue: ListValue;
    firstLabelDefaultValue: ListAttributeValue<string>;
    secondLabelDefaultValue: ListAttributeValue<string>;
    objIdDefaultValue: ListAttributeValue<string | BigJs.Big>;
    imgUrlDefaultValue: ListAttributeValue<string>;
    options: ListValue;
    firstLabelOptions: ListAttributeValue<string>;
    secondLabelOptions: ListAttributeValue<string>;
    objIdOptions: ListAttributeValue<string | BigJs.Big>;
    imgUrlOptions: ListAttributeValue<string>;
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
    const [options, setOptions] = useState<Option[]>([]);
    const [value, setValue] = useState<Option>();

    const createOption = (label: string, secondaryLabel: string, id: string, urlstring: string) => ({
        label: (
            <Label
                DisplayName={label}
                UrlString={urlstring}
                ClassNamePrefix={props.classNamePrefix}
                EnableAvatar={props.useAvatar}
                SecondLabel={secondaryLabel}
            />
        ),
        value: label,
        // eslint-disable-next-line object-shorthand
        id: id,
        secondLabel: secondaryLabel,
        url: urlstring
    });

    useEffect(() => {
        if (props.defaultValue.status === "available") {
            const defaultValue = props.defaultValue.items.map(obj => {
                const {
                    firstLabelDefaultValue,
                    secondLabelDefaultValue,
                    objIdDefaultValue,
                    imgUrlDefaultValue
                }: {
                    firstLabelDefaultValue: string;
                    secondLabelDefaultValue: string;
                    objIdDefaultValue: string;
                    imgUrlDefaultValue: string;
                } = getLabelValuesDefault(obj);
                return createOption(
                    firstLabelDefaultValue,
                    secondLabelDefaultValue,
                    objIdDefaultValue,
                    imgUrlDefaultValue
                );
            });
            if (defaultValue[0] === undefined) {
                setValue(null);
            } else {
                setValue(defaultValue[0]);
            }
        }
    }, [props.defaultValue]);

    useEffect(() => {
        if (props.options.status === "available") {
            const options = props.options.items.map(obj => {
                const {
                    firstLabelOptions,
                    secondLabelOptions,
                    objIdOptions,
                    imgUrlOptions
                }: {
                    firstLabelOptions: string;
                    secondLabelOptions: string;
                    objIdOptions: string;
                    imgUrlOptions: string;
                } = getLabelValuesOption(obj);
                return createOption(firstLabelOptions, secondLabelOptions, objIdOptions, imgUrlOptions);
            });
            setOptions(options);
        }
    }, [props.options]);

    const handleChange = (inputValue: any, actionMeta: any) => {
        switch (actionMeta.action) {
            case "select-option": {
                selectAction(inputValue);
                break;
            }
            case "create-option": {
                createAction(inputValue);
                break;
            }
            case "clear": {
                clearAction(actionMeta);
                break;
            }
        }
    };

    const handleFocus = () => {
        if (props.onFocus && props.onFocus.canExecute) {
            props.onFocus.execute();
        }
    };

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
            valueContainer: () => ({})
        };
    }
    if (props.enableCreate) {
        return (
            <div>
                <style type="text/css" scoped>
                    {getLabelStyles(props.classNamePrefix)}
                </style>
                <CreatableSelect
                    options={options}
                    value={value}
                    onChange={handleChange}
                    isClearable={props.enableClear}
                    isSearchable={props.enableSearch}
                    styles={styles}
                    placeholder={props.placeholder}
                    className={props.className!}
                    classNamePrefix={props.classNamePrefix}
                    maxMenuHeight={props.menuHeight}
                    onFocus={handleFocus}
                />
            </div>
        );
    }
    return (
        <div>
            <style type="text/css" scoped>
                {getLabelStyles(props.classNamePrefix)}
            </style>
            <Select
                options={options}
                value={value}
                onChange={handleChange}
                isClearable={props.enableClear}
                isSearchable={props.enableSearch}
                styles={styles}
                placeholder={props.placeholder}
                className={props.className!}
                classNamePrefix={props.classNamePrefix}
                maxMenuHeight={props.menuHeight}
                onFocus={handleFocus}
            />
        </div>
    );

    function clearAction(actionMeta: any) {
        if (props.contextObjLabel.status === "available") {
            props.contextObjLabel.setValue(actionMeta.removedValues[0].value);
        }
        if (props.contextObjId.status === "available") {
            props.contextObjId.setValue("");
        }
        if (props.clearValue.canExecute) {
            props.clearValue.execute();
        }
        setValue(null);
    }

    function createAction(inputValue: any) {
        if (props.contextObjLabel.status === "available") {
            props.contextObjLabel.setValue(inputValue.value);
        }
        if (props.contextObjId.status === "available") {
            props.contextObjId.setValue("");
        }
        if (props.createValue.canExecute) {
            props.createValue.execute();
        }
    }

    function selectAction(inputValue: any) {
        if (props.contextObjLabel.status === "available") {
            props.contextObjLabel.setValue(inputValue.value);
        }
        if (props.contextObjId.status === "available") {
            props.contextObjId.setValue(inputValue.id);
        }
        if (props.selectOption.canExecute) {
            props.selectOption.execute();
        }
        setValue(createOption(inputValue.value, inputValue.secondLabel, inputValue.id, inputValue.url));
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function getLabelValuesOption(obj) {
        const firstLabelOptions: string = props.firstLabelOptions && props.firstLabelOptions(obj).displayValue;
        const secondLabelOptions: string = props.secondLabelOptions && props.secondLabelOptions(obj).displayValue;
        const objIdOptions: string = props.objIdOptions && props.objIdOptions(obj).displayValue;
        const imgUrlOptions: string = props.imgUrlOptions && props.imgUrlOptions(obj).displayValue;
        return { firstLabelOptions, secondLabelOptions, objIdOptions, imgUrlOptions };
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function getLabelValuesDefault(obj) {
        const firstLabelDefaultValue: string =
            props.firstLabelDefaultValue && props.firstLabelDefaultValue(obj).displayValue;
        const secondLabelDefaultValue: string =
            props.secondLabelDefaultValue && props.secondLabelDefaultValue(obj).displayValue;
        const objIdDefaultValue: string = props.objIdDefaultValue && props.objIdDefaultValue(obj).displayValue;
        const imgUrlDefaultValue: string = props.imgUrlDefaultValue && props.imgUrlDefaultValue(obj).displayValue;
        return { firstLabelDefaultValue, secondLabelDefaultValue, objIdDefaultValue, imgUrlDefaultValue };
    }
}
