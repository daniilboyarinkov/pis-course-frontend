import { useRive } from '@rive-app/react-canvas';
// @ts-ignore
import BookAnimation from './riv/logo.riv';

type BookProps = {
    className?: string;
};

export const LogoAnimation = ({ className }: BookProps) => {
    const { RiveComponent } = useRive({
        src: BookAnimation,
        stateMachines: 'flip',
        autoplay: true,
    });

    return <RiveComponent style={{
        width: '100%',
        height: '100%',
        maxWidth: '100vw',
        maxHeight: '90vh',
    }} className={className} />;
};
