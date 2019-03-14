import React from 'react';
import { View, Text } from 'react-native';
import { I18n } from 'aws-amplify';
import AuthPiece from './AuthPiece';
import { Header } from '../AmplifyUI';

export default class Loading extends AuthPiece {
    constructor(props) {
        super(props);

        this._validAuthStates = ['loading'];
    }

    showComponent(theme) {
        return React.createElement(
            View,
            { style: theme.section },
            React.createElement(
                Header,
                { theme: theme },
                'Hello world'
            )
        );
    }
}
