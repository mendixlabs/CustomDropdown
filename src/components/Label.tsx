import React, { createElement, ReactElement } from 'react';

export interface LabelProps {
    DisplayName: string;
    UrlString: string;
    ClassNamePrefix: string;
    EnableAvatar: boolean;
    SecondLabel: string;
}

// classnames like 'single-value', 'option', 'menu-list' are within React select component and are prefixed with customer prefix
// therefore, styles are injected as scoped styles for the component
export const getStyles = (prefix: string) => `
    .${prefix}__avatar {flex: 0 0 24px; width: 24px; height: 24px; margin-right: 8px;border-radius: 50%; background-position: 50% 50%; background-size: 24px;}
    .${prefix}__avatar---initials {font-size: 9px;}
    .${prefix}__single-value {display: flex;align-items: center;}
    .${prefix}__option {display: flex !important; align-items: center; cursor:pointer;}
    .${prefix}__name {font-size: 14px; }
    .${prefix}__name.${prefix}--name2 {font-size: 12px; line-height: 14px;color: gray; transform: translateY(1px);}
    .${prefix}__divider {width: 0.5rem}
    .${prefix}__menu-list {padding: 0 !important;}
    .${prefix}__avatar--initials {display: flex !important; justify-content: center; align-items: center; background: gray; color: white; text-transform: uppercase; text-align: center; font-size: 9px; font-weight: bold;}
    .${prefix}__avatar--initials.color-a {background: BlueViolet;}
    .${prefix}__avatar--initials.color-b { background: DarkViolet;}
    .${prefix}__avatar--initials.color-c {background: Coral;}
    .${prefix}__avatar--initials.color-d {background: LightCoral;}
    .${prefix}__avatar--initials.color-e {background: DarkOliveGreen;}
    .${prefix}__avatar--initials.color-f {background: GoldenRod;}
    .${prefix}__avatar--initials.color-g {background: MediumAquaMarine;}
    .${prefix}__avatar--initials.color-h {background: Olive;}
    .${prefix}__avatar--initials.color-i {background: RebeccaPurple;}
    .${prefix}__avatar--initials.color-j {background: SlateBlue;}
    .${prefix}__avatar--initials.color-k {background: SteelBlue;}
    .${prefix}__avatar--initials.color-l {background: Tomato;}
    .${prefix}__avatar--initials.color-m {background: Teal;}
    .${prefix}__avatar--initials.color-n {background: Purple;}
    .${prefix}__avatar--initials.color-o {background: Peru;}
    .${prefix}__avatar--initials.color-p {background: MediumVioletRed;}
    .${prefix}__avatar--initials.color-q {background: Chocolate;}
    .${prefix}__avatar--initials.color-r {background: IndianRed;}
    .${prefix}__avatar--initials.color-s {background: MidnightBlue;}
    .${prefix}__avatar--initials.color-t {background: DarkCyan;}
    .${prefix}__avatar--initials.color-u {background: DarkSlateBlue;}
    .${prefix}__avatar--initials.color-v {background: Brown;}
    .${prefix}__avatar--initials.color-w {background: DarkOrchid;}
    .${prefix}__avatar--initials.color-x {background: Darkorange;}
    .${prefix}__avatar--initials.color-y {background: Navy;}
    .${prefix}__avatar--initials.color-z {background: SeaGreen}`;

export default function Label({ ClassNamePrefix: prefix, EnableAvatar, DisplayName, UrlString, SecondLabel }: LabelProps): ReactElement {    

    let avatar: ReactElement;
    if (EnableAvatar) {
        if (UrlString) {
            avatar = (
                <div
                    className={`${prefix}__avatar`}
                    style={{ backgroundImage: `url(${UrlString})` }}
                ></div>
            );
        }
        else {
            const nameSplit = DisplayName.split(' ');
            const names = nameSplit.length;
            let initials = nameSplit[0].charAt(0).toUpperCase();
            const colorClass = `color-${initials.toLowerCase()}`;

            if (names > 1) {
                initials = initials + nameSplit[names - 1].charAt(0).toUpperCase();
            }

            avatar = (
                <div className={`${prefix}__avatar ${prefix}__avatar--initials ${colorClass}`}>
                    {initials}
                </div>
            )
        }
    }

    return (
        <React.Fragment>
            {avatar}
            <div className={`${prefix}__name`}>
                {DisplayName}
            </div>
            {!!SecondLabel && (
                <React.Fragment>
                    <div className={`${prefix}__divider`}></div>
                    <div className={`${prefix}__name ${prefix}--name2`}>
                        {SecondLabel}
                    </div>
                </React.Fragment>
            )}
        </React.Fragment>
    );
}
