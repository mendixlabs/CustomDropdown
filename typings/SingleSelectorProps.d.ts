/**
 * This file was generated from SingleSelector.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix UI Content Team
 */
import { CSSProperties } from "react";
import { ActionValue, EditableValue, ListValue, ListAttributeValue } from "mendix";

export interface SingleSelectorContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    defaultValue: ListValue;
    defaultValueLabel: ListAttributeValue<string>;
    options: ListValue;
    optionsLabel: ListAttributeValue<string>;
    contextObjLabel: EditableValue<string>;
    selectOption?: ActionValue;
    enableCreate: boolean;
    createValue?: ActionValue;
    enableClear: boolean;
    clearValue?: ActionValue;
    enableSearch: boolean;
    useDefaultStyle: boolean;
    placeholder: string;
    className: string;
    classNamePrefix: string;
}

export interface SingleSelectorPreviewProps {
    class: string;
    style: string;
    defaultValue: {} | null;
    defaultValueLabel: string;
    options: {} | null;
    optionsLabel: string;
    contextObjLabel: string;
    selectOption: {} | null;
    enableCreate: boolean;
    createValue: {} | null;
    enableClear: boolean;
    clearValue: {} | null;
    enableSearch: boolean;
    useDefaultStyle: boolean;
    placeholder: string;
    className: string;
    classNamePrefix: string;
}
