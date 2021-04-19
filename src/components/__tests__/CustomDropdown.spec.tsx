import { createElement } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { ValueStatus } from "mendix";

import CustomDropdown from '../CustomDropdownComp';

const defaultValue = () => ({
    status: ValueStatus.Available,
    items: [
        {
            firstLabel: { displayValue: 'label1' },
            secondLabel: { displayValue: 'secondLabel1' },
            imgUrl: { displayValue: 'url1' },
        },
    ]
});

const options = {
    status: ValueStatus.Available,
    items: [
        {
            firstLabel: { displayValue: 'label1' },
            secondLabel: { displayValue: 'secondLabel1' },
            imgUrl: { displayValue: 'url1' },
        },
        {
            firstLabel: { displayValue: 'label2' },
            secondLabel: { displayValue: 'secondLabel2' },
            imgUrl: { displayValue: 'url2' },
        },
        {
            firstLabel: { displayValue: 'label3' },
            secondLabel: { displayValue: 'secondLabel3' },
            imgUrl: { displayValue: 'url3' },
        },
    ]
};

const renderComponent = (override = {}) => {
    const props = {
        defaultValue: defaultValue(),
        firstLabel: (item) => item.firstLabel,
        secondLabel: (item) => item.secondLabel,
        imgUrl: (item) => item.imgUrl,
        options,
        contextObjLabel: {
            status: ValueStatus.Available,
            value: null
        },
        enableCreate: true,
        enableClear: true,
        enableSearch: true,
        useAvatar: true,
        useDefaultStyle: true,
        placeholder: 'placeholder',
        className: 'custom-dropdown',
        classNamePrefix: 'test',
        menuHeight: 0,
        ...override
    };
    // @ts-ignore
    return render(<CustomDropdown {...props} />);
}

describe('Custom dropdown component', () => {
    describe('and menu is shown', () => {
        let container;

        beforeEach(() => {
            const component = renderComponent({ enableCreate: true });
            container = component.container;

            const downButton = container.querySelector('div.test__dropdown-indicator');

            fireEvent.mouseDown(downButton, { button: 1 });

            // for printing the HTML
            // const { debug } = component;
            // debug();
        })

        it('- should render menu', () => {
            const menu = container.querySelector('div.test__menu');
            expect(menu).toBeDefined();
        })

        it('- should render menu items', () => {
            const allAvatars = container.querySelectorAll('div.test__option > div.test__avatar');

            expect(allAvatars).toHaveLength(3);
            expect(allAvatars[0].style['background-image']).toContain('url1');
            expect(allAvatars[1].style['background-image']).toContain('url2');
            expect(allAvatars[2].style['background-image']).toContain('url3');

            const allNames = container.querySelectorAll('div.test__option > div.test__name');
            expect(allNames).toHaveLength(6);
            expect(allNames[0].innerHTML).toBe('label1');
            expect(allNames[1].innerHTML).toBe('secondLabel1');
            expect(allNames[2].innerHTML).toBe('label2');
            expect(allNames[3].innerHTML).toBe('secondLabel2');
            expect(allNames[4].innerHTML).toBe('label3');
            expect(allNames[5].innerHTML).toBe('secondLabel3');
        })
    })

    describe('and clear button is pressed', () => {
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
                },
            });

            const clearButton = component.container.querySelector('div.test__clear-indicator');
            fireEvent.mouseDown(clearButton, { button: 0 });
        })

        it('- should show the placeholder', () => {
            const placeholder = component.container.querySelector('div.test__value-container > div.test__placeholder');
            expect(placeholder).not.toBeNull();
        });

        it('- should call clearValue action', () => {
            expect(clearValue).toHaveBeenCalledTimes(1);
        });
    });
});