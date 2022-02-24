/**
 * This file was generated from CustomDropdown.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue, ListValue, ListAttributeValue } from "mendix";

export interface CustomDropdownContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    editable: boolean;
    defaultValue?: ListValue;
    objIdDefaultValue?: ListAttributeValue<string>;
    firstLabelDefaultValue?: ListAttributeValue<string>;
    secondLabelDefaultValue?: ListAttributeValue<string>;
    imgUrlDefaultValue?: ListAttributeValue<string>;
    options: ListValue;
    objIdOptions?: ListAttributeValue<string>;
    firstLabelOptions: ListAttributeValue<string>;
    secondLabelOptions?: ListAttributeValue<string>;
    imgUrlOptions?: ListAttributeValue<string>;
    paginate: boolean;
    pageSize: number;
    contextObjId: EditableValue<string>;
    contextObjLabel: EditableValue<string>;
    selectOption?: ActionValue;
    enableCreate: boolean;
    createValue?: ActionValue;
    enableClear: boolean;
    clearValue?: ActionValue;
    enableSearch: boolean;
    onFocus?: ActionValue;
    useDefaultStyle: boolean;
    useAvatar: boolean;
    placeholder: string;
    className: string;
    classNamePrefix: string;
    menuHeight: number;
}

export interface CustomDropdownPreviewProps {
    class: string;
    style: string;
    editable: boolean;
    defaultValue: {} | { type: string } | null;
    objIdDefaultValue: string;
    firstLabelDefaultValue: string;
    secondLabelDefaultValue: string;
    imgUrlDefaultValue: string;
    options: {} | { type: string } | null;
    objIdOptions: string;
    firstLabelOptions: string;
    secondLabelOptions: string;
    imgUrlOptions: string;
    paginate: boolean;
    pageSize: number | null;
    contextObjId: string;
    contextObjLabel: string;
    selectOption: {} | null;
    enableCreate: boolean;
    createValue: {} | null;
    enableClear: boolean;
    clearValue: {} | null;
    enableSearch: boolean;
    onFocus: {} | null;
    useDefaultStyle: boolean;
    useAvatar: boolean;
    placeholder: string;
    className: string;
    classNamePrefix: string;
    menuHeight: number | null;
}
