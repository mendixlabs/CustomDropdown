import { useState, createElement, ReactElement, useEffect } from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { Styles } from "react-select/src/styles";
import { OptionTypeBase } from "react-select/src/types";

import { ListValue, EditableValue, ActionValue, ListAttributeValue, ValueStatus } from "mendix";
import Label, { getStyles as getLabelStyles } from "./Label";

export interface Option {
    label: JSX.Element;
    value: string;
    id: string;
    secondLabel: string;
    url: string;
}

enum Actions {
    Select = "select-option",
    Create = "create-option",
    Clear = "clear"
}

interface LabelValues {
    firstLabel: string;
    secondLabel: string;
    objId: string;
    imgUrl: string;
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

    function createOption(label: string, secondLabel: string, id: string, urlstring: string): Option {
        const option: Option = {
            label: (
                <Label
                    DisplayName={label}
                    UrlString={urlstring}
                    ClassNamePrefix={props.classNamePrefix}
                    EnableAvatar={props.useAvatar}
                    SecondLabel={secondLabel}
                />
            ),
            value: label,
            id,
            secondLabel,
            url: urlstring
        };
        return option;
    }

    useEffect(() => {
        if (props.defaultValue.status === ValueStatus.Available) {
            const defaultValue: Option[] = props.defaultValue.items.map(obj => {
                const { firstLabel, secondLabel, objId, imgUrl }: LabelValues = getLabelValuesDefault(obj);
                return createOption(firstLabel, secondLabel, objId, imgUrl);
            });
            if (defaultValue[0] === undefined) {
                setValue(null);
            } else {
                setValue(defaultValue[0]);
            }
        }
    }, [props.defaultValue]);

    useEffect(() => {
        if (props.options.status === ValueStatus.Available) {
            const options = props.options.items.map(obj => {
                const { firstLabel, secondLabel, objId, imgUrl }: LabelValues = getLabelValuesOption(obj);
                return createOption(firstLabel, secondLabel, objId, imgUrl);
            });
            setOptions(options);
        }
    }, [props.options]);

    const handleChange = (inputValue: any, actionMeta: any): void => {
        switch (actionMeta.action) {
            case Actions.Select: {
                selectAction(inputValue);
                break;
            }
            case Actions.Create: {
                createAction(inputValue);
                break;
            }
            case Actions.Clear: {
                clearAction(actionMeta);
                break;
            }
        }
    };

    const handleFocus = (): void => {
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

    function clearAction(actionMeta: any): void {
        if (props.contextObjLabel.status === ValueStatus.Available) {
            props.contextObjLabel.setValue(actionMeta.removedValues[0].value);
        }
        if (props.contextObjId.status === ValueStatus.Available) {
            props.contextObjId.setValue("");
        }
        if (props.clearValue.canExecute) {
            props.clearValue.execute();
        }
        setValue(null);
    }

    function createAction(inputValue: any): void {
        if (props.contextObjLabel.status === ValueStatus.Available) {
            props.contextObjLabel.setValue(inputValue.value);
        }
        if (props.contextObjId.status === ValueStatus.Available) {
            props.contextObjId.setValue("");
        }
        if (props.createValue.canExecute) {
            props.createValue.execute();
        }
    }

    function selectAction(inputValue: any): void {
        if (props.contextObjLabel.status === ValueStatus.Available) {
            props.contextObjLabel.setValue(inputValue.value);
        }
        if (props.contextObjId.status === ValueStatus.Available) {
            props.contextObjId.setValue(inputValue.id);
        }
        if (props.selectOption.canExecute) {
            props.selectOption.execute();
        }
        setValue(createOption(inputValue.value, inputValue.secondLabel, inputValue.id, inputValue.url));
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function getLabelValuesOption(obj) {
        const firstLabel: string = props.firstLabelOptions && props.firstLabelOptions(obj).displayValue;
        const secondLabel: string = props.secondLabelOptions && props.secondLabelOptions(obj).displayValue;
        const objId: string = props.objIdOptions && props.objIdOptions(obj).displayValue;
        const imgUrl: string = props.imgUrlOptions && props.imgUrlOptions(obj).displayValue;
        return { firstLabel, secondLabel, objId, imgUrl };
    }

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    function getLabelValuesDefault(obj) {
        const firstLabel: string = props.firstLabelDefaultValue && props.firstLabelDefaultValue(obj).displayValue;
        const secondLabel: string = props.secondLabelDefaultValue && props.secondLabelDefaultValue(obj).displayValue;
        const objId: string = props.objIdDefaultValue && props.objIdDefaultValue(obj).displayValue;
        const imgUrl: string = props.imgUrlDefaultValue && props.imgUrlDefaultValue(obj).displayValue;
        return { firstLabel, secondLabel, objId, imgUrl };
    }
}
