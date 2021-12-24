import { createElement, ReactElement, Component } from "react";
import Select from "react-select";
import Creatable from "react-select/creatable";
import { Styles } from "react-select/src/styles";
import { OptionTypeBase } from "react-select/src/types";
import { withAsyncPaginate, ShouldLoadMore } from "react-select-async-paginate";

import { ValueStatus } from "mendix";
import { contains, attribute, literal, or } from "mendix/filters/builders";

import { CustomDropdownContainerProps } from "../../../typings/CustomDropdownProps";
import Label, { getStyles as getLabelStyles } from "./Label";

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

interface State {
    value: Option;
}

const CreatablePaginate = withAsyncPaginate(Creatable);
const SelectPaginate = withAsyncPaginate(Select);

export default class CustomDropdown extends Component<CustomDropdownContainerProps, State> {
    constructor(props: CustomDropdownContainerProps) {
        super(props);
        props.options.setLimit(this.props.pageSize);
        props.options.setOffset(0);

        this.state = {
            value: null
        };
    }

    _resolveLoadOptions: (options: Option[]) => void;
    _waitAnotherPropsUpdate: boolean;

    componentDidMount(): void {
        if (this.props.defaultValue.status === ValueStatus.Available && this.props.defaultValue.items?.length) {
            this.setValue(this.getDefaultValue());
        }
    }

    componentDidUpdate(prevProps: CustomDropdownContainerProps): void {
        if (
            prevProps.defaultValue !== this.props.defaultValue &&
            this.props.defaultValue.status === ValueStatus.Available
        ) {
            this.setValue(this.getDefaultValue());
        }
    }

    // https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
    // will work in version 17.
    // eventually this has to be migrated to memoization helper with useMemo.
    UNSAFE_componentWillReceiveProps(nextProps: CustomDropdownContainerProps): void {
        if (this._waitAnotherPropsUpdate) {
            this._waitAnotherPropsUpdate = false;
            return;
        }

        const options = this.getOptions(nextProps);
        this._resolveLoadOptions && this._resolveLoadOptions(options);
        this._resolveLoadOptions = null;
    }

    createOption = (label: string, secondLabel: string, id: string, imageUrl: string): Option => ({
        label: (
            <Label
                DisplayName={label}
                UrlString={imageUrl}
                ClassNamePrefix={this.props.classNamePrefix}
                EnableAvatar={this.props.useAvatar}
                SecondLabel={secondLabel}
            />
        ),
        value: label,
        id,
        secondLabel,
        url: imageUrl
    });

    setValue = (value: Option): void => this.setState({ value });

    clearAction = (actionMeta: any): void => {
        if (this.props.contextObjLabel.status === ValueStatus.Available) {
            this.props.contextObjLabel.setValue(actionMeta.removedValues[0].value);
        }
        if (this.props.contextObjId.status === ValueStatus.Available) {
            this.props.contextObjId.setValue("");
        }
        if (this.props.clearValue.canExecute) {
            this.props.clearValue.execute();
        }
        this.setValue(null);
    };

    createAction = (inputValue: any): void => {
        if (this.props.contextObjLabel.status === ValueStatus.Available) {
            this.props.contextObjLabel.setValue(inputValue.value);
        }
        if (this.props.contextObjId.status === ValueStatus.Available) {
            this.props.contextObjId.setValue("");
        }
        if (this.props.createValue.canExecute) {
            this.props.createValue.execute();
        }
    };

    selectAction = (inputValue: any): void => {
        if (this.props.contextObjLabel.status === ValueStatus.Available) {
            this.props.contextObjLabel.setValue(inputValue.value);
        }
        if (this.props.contextObjId.status === ValueStatus.Available) {
            this.props.contextObjId.setValue(inputValue.id);
        }
        if (this.props.selectOption.canExecute) {
            this.props.selectOption.execute();
        }
        this.setValue(this.createOption(inputValue.value, inputValue.secondLabel, inputValue.id, inputValue.url));
    };

    getLabelValuesOption = (obj): LabelValues => {
        //Accessing an attribute from the list item directly is deprecated since mx9, but the get() function doesn't yet exist yet in mx8. Thats why we have this check, to have the widget work in both versions.
        const firstLabel: string =
            this.props.firstLabelOptions && "get" in this.props.firstLabelOptions
                ? this.props.firstLabelOptions.get(obj).displayValue
                : this.props.firstLabelOptions(obj).displayValue;
        const secondLabel: string =
            this.props.secondLabelOptions && "get" in this.props.secondLabelOptions
                ? this.props.secondLabelOptions.get(obj).displayValue
                : this.props.secondLabelOptions(obj).displayValue;
        const objId: string =
            this.props.objIdOptions && "get" in this.props.objIdOptions
                ? this.props.objIdOptions.get(obj).displayValue
                : this.props.objIdOptions(obj).displayValue;
        const imgUrl: string =
            this.props.imgUrlOptions && "get" in this.props.imgUrlOptions
                ? this.props.imgUrlOptions.get(obj).displayValue
                : this.props.imgUrlOptions(obj).displayValue;
        return { firstLabel, secondLabel, objId, imgUrl };
    };

    getLabelValuesDefault = (obj): LabelValues => {
        //Accessing an attribute from the list item directly is deprecated since mx9, but the get() function doesn't yet exist yet in mx8. Thats why we have this check, to have the widget work in both versions.
        const firstLabel: string =
            this.props.firstLabelDefaultValue && "get" in this.props.firstLabelDefaultValue
                ? this.props.firstLabelDefaultValue.get(obj).displayValue
                : this.props.firstLabelDefaultValue(obj).displayValue;
        const secondLabel: string =
            this.props.secondLabelDefaultValue && "get" in this.props.secondLabelDefaultValue
                ? this.props.secondLabelDefaultValue.get(obj).displayValue
                : this.props.secondLabelDefaultValue(obj).displayValue;
        const objId: string =
            this.props.objIdDefaultValue && "get" in this.props.objIdDefaultValue
                ? this.props.objIdDefaultValue.get(obj).displayValue
                : this.props.objIdDefaultValue(obj).displayValue;
        const imgUrl: string =
            this.props.imgUrlDefaultValue && "get" in this.props.imgUrlDefaultValue
                ? this.props.imgUrlDefaultValue.get(obj).displayValue
                : this.props.imgUrlDefaultValue(obj).displayValue;
        return { firstLabel, secondLabel, objId, imgUrl };
    };

    handleChange = (inputValue: any, actionMeta: any): void => {
        switch (actionMeta.action) {
            case Actions.Select: {
                this.selectAction(inputValue);
                break;
            }
            case Actions.Create: {
                this.createAction(inputValue);
                break;
            }
            case Actions.Clear: {
                this.clearAction(actionMeta);
                break;
            }
        }
    };

    handleFocus = (): void => {
        if (this.props.onFocus && this.props.onFocus.canExecute) {
            this.props.onFocus.execute();
        }
    };

    getOptions = (props: CustomDropdownContainerProps = this.props): Option[] => {
        if (!props.options || props.options.status !== ValueStatus.Available) {
            return [];
        }

        return props.options.items.map(obj => {
            const { firstLabel, secondLabel, objId, imgUrl }: LabelValues = this.getLabelValuesOption(obj);
            return this.createOption(firstLabel, secondLabel, objId, imgUrl);
        });
    };

    getDefaultValue = (): Option => {
        const defaultValue = this.props.defaultValue.items.map(obj => {
            const { firstLabel, secondLabel, objId, imgUrl }: LabelValues = this.getLabelValuesDefault(obj);
            return this.createOption(firstLabel, secondLabel, objId, imgUrl);
        });

        return defaultValue[0] || null;
    };

    loadOptions = async (searchQuery: string, loadedOptions: Option[], { page }: any) => {
        try {
            const { offset, limit, hasMoreItems: hasMore, filter } = this.props.options;
            console.debug("loadOptions:", loadedOptions.length, page, offset, limit, hasMore);

            let timeout: NodeJS.Timeout;

            const newOptions: Option[] = await new Promise(resolve => {
                this._resolveLoadOptions = resolve;

                // filtering
                // https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-client-apis-list-values#listvalue-filtering
                if (searchQuery && this.props.firstLabelOptions.filterable) {
                    const filterCond = or(
                        contains(attribute(this.props.firstLabelOptions.id), literal(searchQuery)),
                        contains(attribute(this.props.secondLabelOptions.id), literal(searchQuery))
                    );

                    this._waitAnotherPropsUpdate = true;

                    this.props.options.setFilter(filterCond);
                } else if (filter && this.props.firstLabelOptions.filterable) {
                    this._waitAnotherPropsUpdate = true;
                    this.props.options.setFilter(undefined);
                }

                // https://docs.mendix.com/apidocs-mxsdk/apidocs/pluggable-widgets-client-apis-list-values#listvalue-pagination
                this.props.options.setLimit(page * this.props.pageSize);
                timeout = setTimeout(() => resolve(this.getOptions()), 5000);
            });

            clearTimeout(timeout);

            return {
                options: newOptions,
                hasMore,
                additional: {
                    page: searchQuery ? 1 : page + 1
                }
            };
        } catch (error) {
            console.error("Failed to load new options", error);
        }
    };

    render(): ReactElement {
        const { paginate, useDefaultStyle, defaultValue } = this.props;
        let styles: Styles<OptionTypeBase, true> = {};
        if (!useDefaultStyle) {
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

        const isLoading = defaultValue?.status === ValueStatus.Loading;
        const propsOverride: { shouldLoadMore?: ShouldLoadMore } = paginate
            ? {}
            : {
                  shouldLoadMore: () => false
              };

        if (this.props.enableCreate) {
            return (
                <div>
                    <style type="text/css" scoped>
                        {getLabelStyles(this.props.classNamePrefix)}
                    </style>
                    <CreatablePaginate
                        SelectComponent={Creatable}
                        loadOptions={this.loadOptions}
                        value={this.state.value}
                        onChange={this.handleChange}
                        isClearable={this.props.enableClear}
                        isSearchable={this.props.enableSearch}
                        styles={styles}
                        placeholder={isLoading ? "Loading..." : this.props.placeholder}
                        className={this.props.className!}
                        classNamePrefix={this.props.classNamePrefix}
                        additional={{
                            page: 1
                        }}
                        reduceOptions={(_, loaded) => loaded}
                        maxMenuHeight={this.props.menuHeight}
                        onFocus={this.handleFocus}
                        {...propsOverride}
                    />
                </div>
            );
        }

        return (
            <div>
                <style type="text/css" scoped>
                    {getLabelStyles(this.props.classNamePrefix)}
                </style>
                <SelectPaginate
                    loadOptions={this.loadOptions}
                    value={this.state.value}
                    onChange={this.handleChange}
                    isClearable={this.props.enableClear}
                    isSearchable={this.props.enableSearch}
                    styles={styles}
                    placeholder={isLoading ? "Loading..." : this.props.placeholder}
                    className={this.props.className!}
                    classNamePrefix={this.props.classNamePrefix}
                    additional={{
                        page: 1
                    }}
                    reduceOptions={(_, loaded) => loaded}
                    maxMenuHeight={this.props.menuHeight}
                    onFocus={this.handleFocus}
                    {...propsOverride}
                />
            </div>
        );
    }
}
