import {FormInput, IFormInput} from './FormInput';
import React from 'react';

interface IModalProps {
    fields: IFormInput[],
    name: string,
    submitAction: any,
    submitColor?: string,
}

export default function Modal(props: IModalProps) {
    return (
        <>
        <input type="checkbox" id={props.name} className="modal-toggle"/>
        <label htmlFor={props.name} className="modal cursor-pointer">
            <form className="modal-box relative grid gap-4 grid-cols-2" onSubmit={props.submitAction}>
                {
                    props.fields.map(inp => (
                        <FormInput
                            key={inp.id}
                            {...inp}
                        />
                    ))
                }
                <button className={`btn btn-${props.submitColor} col-span-2`}>Submit</button>
            </form>
        </label>
        </>
    );
}
