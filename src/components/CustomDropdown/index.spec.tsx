import { createElement } from "react";
import { render, fireEvent, screen, waitForElementToBeRemoved, queryByText } from "@testing-library/react";
import { ValueStatus } from "mendix";

import CustomDropdown from "./index";

jest.mock("mendix/filters/builders", () => {
    return {
        contains: jest.fn().mockReturnValue("filter"),
        attribute: jest.fn().mockReturnValue("filter"),
        literal: jest.fn().mockReturnValue("filter"),
        or: jest.fn().mockReturnValue("filter")
    };
});

interface Value {
    status: ValueStatus;
    items: Item[];
}

interface Item {
    firstLabel: {
        displayValue: string;
    };
    secondLabel: {
        displayValue: string;
    };
    imgUrl: {
        status: ValueStatus;
        displayValue: string;
    };
}
const items = Array.from(Array(10).keys()).map(i => ({
    firstLabel: { displayValue: `label${i + 1}` },
    secondLabel: { displayValue: `secondLabel${i + 1}` },
    imgUrl: {
        status: ValueStatus.Available,
        displayValue: `url${i + 1}`
    }
}));

const defaultValue = (): Value => ({
    status: ValueStatus.Available,
    items: items.slice(0, 1)
});

const defaultOptions = {
    status: ValueStatus.Available,
    items: items.slice(0, 3),
    setOffset: jest.fn(),
    setLimit: jest.fn(),
    offset: 0,
    limit: 1000,
    filter: null,
    hasMoreItems: false,
    paginate: true,
    pageSize: 10
};

const defaultProps = {
    defaultValue: defaultValue(),
    firstLabelDefaultValue: { get: item => item.firstLabel },
    secondLabelDefaultValue: { get: item => item.secondLabel },
    imgUrlDefaultValue: { get: item => item.imgUrl },
    options: defaultOptions,
    firstLabelOptions: { get: item => item.firstLabel, filterable: true, id: "attr_hnj_21" },
    secondLabelOptions: { get: item => item.secondLabel, filterable: true, id: "attr_hnj_22" },
    imgUrlOptions: { get: item => item.imgUrl },
    contextObjLabel: {
        status: ValueStatus.Available,
        value: null
    },
    enableCreate: true,
    enableClear: true,
    enableSearch: true,
    useAvatar: true,
    useDefaultStyle: true,
    placeholder: "placeholder",
    className: "custom-dropdown",
    classNamePrefix: "test",
    menuHeight: 0,
    paginate: true,
    pageSize: 10
};

const renderComponent = (override = {}, rerender = null) => {
    const props = {
        ...defaultProps,
        ...override
    };

    const renderFn = rerender || render;
    // @ts-ignore
    return renderFn(<CustomDropdown {...props} />);
};

describe("Custom dropdown component", () => {
    describe("when menu is shown", () => {
        let container;
        let rerender;

        beforeEach(async () => {
            const override = {
                enableCreate: true,
                options: {
                    ...defaultOptions,
                    setLimit: jest.fn(() => setInterval(() => renderComponent(override, rerender), 0))
                }
            };
            const component = renderComponent(override);
            container = component.container;
            // https://testing-library.com/docs/example-update-props/
            rerender = component.rerender;

            const downButton = container.querySelector("div.test__dropdown-indicator");

            fireEvent.mouseDown(downButton, { button: 1 });

            await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));

            // for printing the HTML
            // const { debug } = component;
            // debug();
        });

        it("- should render menu", () => {
            const menu = container.querySelector("div.test__menu");
            expect(menu).not.toBeNull();
        });

        it("- should render menu items", () => {
            const allAvatars = container.querySelectorAll("div.test__option > div.test__container > div.test__avatar");

            expect(allAvatars).toHaveLength(3);
            expect(allAvatars[0].style["background-image"]).toContain("url1");
            expect(allAvatars[1].style["background-image"]).toContain("url2");
            expect(allAvatars[2].style["background-image"]).toContain("url3");

            const allNames = container.querySelectorAll("div.test__option > div.test__container > div.test__name");
            expect(allNames).toHaveLength(6);
            expect(allNames[0].innerHTML).toBe("label1");
            expect(allNames[1].innerHTML).toBe("secondLabel1");
            expect(allNames[2].innerHTML).toBe("label2");
            expect(allNames[3].innerHTML).toBe("secondLabel2");
            expect(allNames[4].innerHTML).toBe("label3");
            expect(allNames[5].innerHTML).toBe("secondLabel3");
        });
    });

    describe("when clear button is pressed", () => {
        let component;
        const clearValue = jest.fn();
        const contextObjLabelSetValue = jest.fn();
        const contextObjIdSetValue = jest.fn();

        beforeEach(() => {
            component = renderComponent({
                clearValue: {
                    canExecute: true,
                    execute: clearValue
                },
                contextObjLabel: {
                    status: ValueStatus.Available,
                    value: null,
                    setValue: contextObjLabelSetValue
                },
                contextObjId: {
                    status: ValueStatus.Available,
                    value: null,
                    setValue: contextObjIdSetValue
                }
            });

            const clearButton = component.container.querySelector("div.test__clear-indicator");
            fireEvent.mouseDown(clearButton, { button: 0 });
        });

        it("- should show the placeholder", () => {
            const placeholder = component.container.querySelector("div.test__value-container > div.test__placeholder");
            expect(placeholder).not.toBeNull();
        });

        it("- should call clearValue action", () => {
            expect(clearValue).toHaveBeenCalledTimes(1);
        });
    });

    describe("New entry is created", () => {
        let component;
        let rerender;
        const createValue = jest.fn();
        const contextObjLabelSetValue = jest.fn();
        const contextObjIdSetValue = jest.fn();

        beforeEach(async () => {
            let optionItems = items;
            let filter = null;
            const override = {
                createValue: {
                    canExecute: true,
                    execute: createValue
                },
                contextObjLabel: {
                    status: ValueStatus.Available,
                    value: null,
                    setValue: contextObjLabelSetValue
                },
                contextObjId: {
                    status: ValueStatus.Available,
                    value: null,
                    setValue: contextObjIdSetValue
                },
                options: {
                    ...defaultOptions,
                    filter,
                    setLimit: jest.fn(() => {
                        setInterval(() => {
                            renderComponent(
                                { ...override, options: { ...override.options, items: optionItems } },
                                rerender
                            );
                        }, 0);
                    }),
                    setFilter: jest.fn(cond => {
                        optionItems = cond ? [] : items;
                        filter = cond;
                        setInterval(() => {
                            renderComponent(
                                { ...override, options: { ...override.options, items: optionItems } },
                                rerender
                            );
                        }, 0);
                    })
                }
            };
            component = renderComponent(override);
            rerender = component.rerender;

            const inputValue = component.container.querySelector("div.test__input > input");
            fireEvent.change(inputValue, { target: { value: "This is a new value" } });

            await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
        });

        it("- should show option to create value", () => {
            expect(component.container.querySelector("div.test__menu-list > div.test__option")!.textContent).toBe(
                'Create "This is a new value"'
            );
        });

        describe("and Enter key down", () => {
            beforeEach(() => {
                const createOption = component.container.querySelector("div.test__menu-list > div.test__option");
                fireEvent.keyDown(createOption, { key: "Enter", code: "Enter" });
            });

            it("- should create a value", () => {
                expect(createValue).toHaveBeenCalledTimes(1);
            });
        });
    });

    describe("Selection is changed", () => {
        let component;
        let rerender;
        const selectOption = jest.fn();
        const contextObjLabelSetValue = jest.fn();
        const contextObjIdSetValue = jest.fn();

        beforeEach(async () => {
            let optionItems = items;
            let filter = null;
            const override = {
                selectOption: {
                    canExecute: true,
                    execute: selectOption
                },
                contextObjLabel: {
                    status: ValueStatus.Available,
                    value: null,
                    setValue: contextObjLabelSetValue
                },
                contextObjId: {
                    status: ValueStatus.Available,
                    value: null,
                    setValue: contextObjIdSetValue
                },
                options: {
                    ...defaultOptions,
                    filter,
                    setLimit: jest.fn(() => {
                        setInterval(() => {
                            renderComponent(
                                { ...override, options: { ...override.options, items: optionItems } },
                                rerender
                            );
                        }, 0);
                    }),
                    setFilter: jest.fn(cond => {
                        optionItems = cond ? [items.find(item => item.firstLabel.displayValue === "label3")] : items;
                        filter = cond;
                        setInterval(() => {
                            renderComponent(
                                { ...override, options: { ...override.options, items: optionItems } },
                                rerender
                            );
                        }, 0);
                    })
                }
            };
            component = renderComponent(override);
            rerender = component.rerender;

            const inputValue = component.container.querySelector("div.test__input > input");
            fireEvent.change(inputValue, { target: { value: "label3" } });

            await waitForElementToBeRemoved(() => screen.queryByText("Loading..."));
        });

        it("- should show value in menu", () => {
            expect(component.container.querySelector("div.test__menu-list > div.test__option")!.textContent).toBe(
                "label3secondLabel3"
            );
        });

        it("- should select the value", () => {
            const createOption = component.container.querySelector("div.test__menu-list > div.test__option");

            fireEvent.keyDown(createOption, { key: "Enter", code: "Enter" });
            expect(selectOption).toHaveBeenCalledTimes(1);
        });
    });

    describe("when options are loading", () => {
        let container;

        beforeEach(() => {
            const component = renderComponent({
                options: {
                    ...defaultOptions,
                    status: ValueStatus.Loading,
                    items: []
                }
            });
            container = component.container;

            const downButton = container.querySelector("div.test__dropdown-indicator");

            fireEvent.mouseDown(downButton, { button: 1 });
        });

        it("- should show loading icon", () => {
            const indicator = container.querySelector("div.test__loading-indicator");
            expect(indicator).not.toBeNull();
        });
    });

    describe("when default item is loading", () => {
        beforeEach(() => {
            renderComponent({
                defaultValue: {
                    status: ValueStatus.Loading,
                    items: []
                }
            });
        });

        it("- should show loading placeholder", () => {
            const indicator = screen.getByText("Loading...");
            expect(indicator).not.toBeNull();
        });
    });

    describe("When pagination is false", () => {
        const setLimit = jest.fn();
        beforeEach(async () => {
            const override = {
                options: {
                    ...defaultOptions,
                    paginate: false,
                    setLimit
                },
                paginate: false,
            };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const component = renderComponent(override);
        });

        it("- should not set the limit", () => {
            expect(setLimit).toBeCalledTimes(0);
        });
    });
});
