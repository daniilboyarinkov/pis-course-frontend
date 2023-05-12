import React from 'react';

export type IFormInput = {
    id?: string | number;
    label_text: string;
    type: 'number' | 'text' | 'radio' | 'bool';
    items?: any[],
    renderItemName?: string,
    onChangeItemName?: string,
    placeholder?: string,
    value: string | number | boolean,
    onChange: (value: any) => void,
}

export const FormInput = (props: IFormInput) => {
    return (
        <div className="form-control w-full max-w-xs">
            <label className="label">
                <span className="label-text text-white underline underline-offset-4">
                    {props.label_text}
                </span>
            </label>
            {
                props.type === 'radio'
                    ? (
                        <div className="form-control">
                            {props.items?.map((item, index) => (
                                <label key={index} className="label cursor-pointer">
                                    <span className="label-text">{item[props.renderItemName ?? ''] ?? item}</span>
                                    <input
                                        checked={String(props.value).toLowerCase() === (item[props.onChangeItemName || props.renderItemName || '']?.toString() ?? String(item).toLowerCase())}
                                        onChange={() => props.onChange(item[props.onChangeItemName || props.renderItemName || ''] ?? item)}
                                        type="radio"
                                        name={props.label_text}
                                        className="radio checked:bg-red-500"
                                    />
                                </label>
                            ))}
                        </div>
                    )
                    : props.type === 'bool'
                        ? (
                            <div className="form-control">
                                <label className="label cursor-pointer">
                                    <input type="checkbox" checked={!!props.value} onChange={props.onChange} className="checkbox checkbox-primary" />
                                </label>
                            </div>
                        )
                        : (
                            <input
                                type={props.type}
                                min={0}
                                placeholder={props.placeholder ?? ""}
                                // @ts-ignore
                                value={props.value}
                                onChange={props.onChange}
                                className="input input-bordered w-full max-w-xs"
                            />
                        )
            }
        </div>
    );
}
