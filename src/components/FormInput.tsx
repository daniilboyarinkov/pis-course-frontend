import React from 'react';

export type IFormInput = {
    id?: string | number;
    label_text: string;
    type: 'number' | 'text';
    placeholder?: string;
    value: string | number;
    onChange: (value: any) => void;
}

export const FormInput = (props: IFormInput) => {
    return (
        <div className="form-control w-full max-w-xs">
            <label className="label">
                <span className="label-text">
                    {props.label_text}
                </span>
            </label>
            <input
                type={props.type}
                min={0}
                placeholder={props.placeholder ?? ""}
                value={props.value}
                onChange={props.onChange}
                className="input input-bordered w-full max-w-xs"
            />
        </div>
    );
}
