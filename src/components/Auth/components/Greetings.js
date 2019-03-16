import React from 'react';
import {
    View,
    Text,
    Button
} from 'react-native';
import {
    Auth,
    I18n,
    Logger
} from 'aws-amplify';
import { AmplifyButton } from '../AmplifyUI';
import AmplifyTheme from '../AmplifyTheme';
import AuthPiece from './AuthPiece';

const logger = new Logger('Greetings');

export default class Greetings extends AuthPiece {
    constructor(props) {
        super(props);

        this.signOut = this.signOut.bind(this);
    }

    signOut() {
        Auth.signOut()
            .then(() => this.changeState('signedOut'))
            .catch(err => this.error(err));
    }

    render() {
        const { authState } = this.props;
        const signedIn = (authState === 'signedIn');
        const theme = this.props.theme || AmplifyTheme;

        let defaultMessage = "";
        if (Auth.user && Auth.user.username) {
            defaultMessage = `${I18n.get('Hello')} ${Auth.user.username}`;
        }

        let message;
        if (signedIn) {
            message = this.props.signedInMessage || defaultMessage;
        } else {
            message = this.props.signedOutMessage || I18n.get("Please Sign In / Sign Up");
        }

        const content = signedIn ? (
            <View style={theme.navBar}>
                <Text>{message}</Text>
                <AmplifyButton
                    theme={theme}
                    text={I18n.get('Sign Out')}
                    onPress={this.signOut}
                    style={theme.navButton}
                />
            </View>
        ) : (
            <Text>{message}</Text>
        );

        return content;
    }
}
