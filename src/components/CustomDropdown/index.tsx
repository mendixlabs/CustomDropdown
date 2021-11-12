import { useState, createElement, ReactElement, useEffect, useRef } from "react";
import Select from "react-select";
import { ValueStatus } from "mendix";
import { contains } from "mendix/filters/builders";
import CreatableSelect from "react-select/creatable";
import { Styles } from "react-select/src/styles";
import { OptionTypeBase } from "react-select/src/types";

import { CustomDropdownContainerProps } from "../../../typings/CustomDropdownProps";
import Label, { getStyles as getLabelStyles } from "./Label";
import { AsyncPaginate, withAsyncPaginate } from "react-select-async-paginate";
import { attribute, literal, startsWith } from "mendix/filters/builders";
import Creatable from "react-select/creatable";

export interface Option {
    id: string;
    label: JSX.Element | string;
    value?: string;
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

export default function CustomDropdown(props: CustomDropdownContainerProps): ReactElement {
    const [value, setValue] = useState<Option>();
    const [options, setOptions] = useState<Option[]>([]);
    const pageSize = 10;

    useEffect(() => {
        props.options.setLimit(pageSize * 3);
        props.options.setOffset(0);
    }, []);

    const createOption = (label: string, secondLabel: string, id: string, imageUrl: string): Option => ({
        label: (
            <Label
                DisplayName={label}
                UrlString={imageUrl}
                ClassNamePrefix={props.classNamePrefix}
                EnableAvatar={props.useAvatar}
                SecondLabel={secondLabel}
            />
        ),
        value: label,
        id,
        secondLabel,
        url: imageUrl
    });

    const clearAction = (actionMeta: any): void => {
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
    };

    const createAction = (inputValue: any): void => {
        if (props.contextObjLabel.status === ValueStatus.Available) {
            props.contextObjLabel.setValue(inputValue.value);
        }
        if (props.contextObjId.status === ValueStatus.Available) {
            props.contextObjId.setValue("");
        }
        if (props.createValue.canExecute) {
            props.createValue.execute();
        }
    };

    const selectAction = (inputValue: any): void => {
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
    };

    const getLabelValuesOption = (obj): LabelValues => {
        const firstLabel: string = props.firstLabelOptions && props.firstLabelOptions(obj).displayValue;
        const secondLabel: string = props.secondLabelOptions && props.secondLabelOptions(obj).displayValue;
        const objId: string = props.objIdOptions && props.objIdOptions(obj).displayValue;
        const imgUrl: string = props.imgUrlOptions && props.imgUrlOptions(obj).displayValue;
        return { firstLabel, secondLabel, objId, imgUrl };
    };

    const getLabelValuesDefault = (obj): LabelValues => {
        const firstLabel: string = props.firstLabelDefaultValue && props.firstLabelDefaultValue(obj).displayValue;
        const secondLabel: string = props.secondLabelDefaultValue && props.secondLabelDefaultValue(obj).displayValue;
        const objId: string = props.objIdDefaultValue && props.objIdDefaultValue(obj).displayValue;
        const imgUrl: string = props.imgUrlDefaultValue && props.imgUrlDefaultValue(obj).displayValue;
        return { firstLabel, secondLabel, objId, imgUrl };
    };

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

    const getOptions = (): Option[] => {
        if (!props.options || props.options.status !== ValueStatus.Available) {
            return [];
        }

        return props.options.items.map(obj => {
            const { firstLabel, secondLabel, objId, imgUrl }: LabelValues = getLabelValuesOption(obj);
            return createOption(firstLabel, secondLabel, objId, imgUrl);
        });
    };

    const loadOptions = async (searchQuery: any, loadedOptions: Option[], { page }: any) => {
        const { offset, limit } = props.options;
        console.log("loadOptions:", loadedOptions.length, page, offset, limit);
        props.options.setLimit(loadedOptions.length + pageSize * 3);
        if (searchQuery) {
            console.log("search query 11:", searchQuery );
            //console.log('attribute',attribute(this.props.loadedOptions.label));
            // @ts-ignore
            const filterCond = contains(attribute("Name"), literal(searchQuery));
            // const filterCond = this.props.options.filter(({ entry  }: any) =>
            //     contains(attribute(entry.label), searchQuery)
            // );
            this.props.options.setFilter(filterCond);
         }else {
            console.log("Attribute is not filterable");
         }
        const nextPage = options.slice(loadedOptions.length, loadedOptions.length + 10);
        // let filteredOptions;
        // if (!searchQuery) {
        //     filteredOptions = nextPage;
        //     console.log("no search query:");
        //   } else {
        //     const searchLower = searchQuery.toLowerCase();
        //     console.log("search query is :", searchQuery, searchLower);
        //     filteredOptions = nextPage.filter(({ attribute  }: any) =>         
        //         attribute.label.toLowerCase().includes(searchLower)       
        //     );
        //   }
        return {
            options: nextPage,
            hasMore: options.length > loadedOptions.length + pageSize,
            additional: {
                page: searchQuery ? 2 : page + 1
            }
        };
    };

    useEffect(() => {
        const newOptions = getOptions();
        console.log("new options:", newOptions);
        setOptions(newOptions);
    }, [props.options]);

    useEffect(() => {
        if (props.defaultValue.status === ValueStatus.Available) {
            const defaultValue = props.defaultValue.items.map(obj => {
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

    const isLoading =
        props.options.status === ValueStatus.Loading ||
        (props.defaultValue && props.defaultValue.status === ValueStatus.Loading);

    const initialOptions = options.slice(0, pageSize);
    const CreatablePaginate = withAsyncPaginate(CreatableSelect);
    const SelectPaginate = withAsyncPaginate(Select);

    if (props.enableCreate) {
        console.log('enable create ..................',props.enableCreate)
        return (
            <div>
                <style type="text/css" scoped>
                    {getLabelStyles(props.classNamePrefix)}
                </style>
                <AsyncPaginate
                    /*
                    // @ts-ignore */
                    SelectComponent={Creatable}
                    loadOptions={loadOptions}
                    options={initialOptions}
                    value={value}
                    onChange={handleChange}
                    isClearable={props.enableClear}
                    isSearchable={props.enableSearch}
                    isLoading={isLoading}
                    styles={styles}
                    placeholder={props.placeholder}
                    className={props.className!}
                    classNamePrefix={props.classNamePrefix}
                    additional={{
                        page: 1
                    }}
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
            <AsyncPaginate
                /*
                // @ts-ignore */
                loadOptions={loadOptions}
                options={initialOptions}
                value={value}
                onChange={handleChange}
                isClearable={props.enableClear}
                isSearchable={props.enableSearch}
                isLoading={isLoading}
                styles={styles}
                placeholder={props.placeholder}
                className={props.className!}
                classNamePrefix={props.classNamePrefix}
                additional={{
                    page: 1
                }}
                maxMenuHeight={props.menuHeight}
                onFocus={handleFocus}
            />
        </div>
    );
}