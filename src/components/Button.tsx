import React from 'react';
import { Button as ButtonNativeBase, IButtonProps, Heading } from 'native-base';

type Props = IButtonProps & {
    title: string;
    btnColor?: string;
};

export function Button({ title, btnColor = 'white', ...rest }: Props) {
    return (
        <ButtonNativeBase
            bg='green.700'
            h={14}
            fontSize='sm'
            rounded='sm'
            _pressed={{
                bg: 'green.500',
            }}
            {...rest}
        >
            <Heading
                color={btnColor}
                fontSize='sm'
            >
                {title}
            </Heading>
        </ButtonNativeBase>
    );
}
