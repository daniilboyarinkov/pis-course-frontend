interface IFormErrorMessageProps{
    message: string,
}

export default function FormErrorMessage(props: IFormErrorMessageProps) {
    return (
        <p className="text-red-500 mt-2">
            {'* ' + props.message}
        </p>
    );
}
