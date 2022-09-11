import React from 'react';
import { Center, Spinner } from 'native-base';

export default function Loading() {
    return (
        <Center
            flex={1}
            bg='gray.700'
        >
            <Spinner color='secondary.700' />
        </Center>
    );
}
