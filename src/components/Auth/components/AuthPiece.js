import React from 'react';

import { Auth, Logger, JS } from 'aws-amplify';

import AmplifyTheme from '../AmplifyTheme';
import AmplifyMessageMap from '../AmplifyMessageMap';
import { Toast } from 'native-base';


const logger = new Logger('AuthPiece');

export default class AuthPiece extends React.Component {
    constructor(props) {
        super(props);

        this._isHidden = true;
        this._validAuthStates = [];
        this.changeState = this.changeState.bind(this);
        this.error = this.error.bind(this);
    }

    changeState(state, data) {
        if (this.props.onStateChange) {
            this.props.onStateChange(state, data);
        }
    }

    checkContact(user) {
        Auth.verifiedContact(user).then(data => {
            logger.debug('verified user attributes', data);
            if (!JS.isEmpty(data.verified)) {
                this.changeState('signedIn', user);
            } else {
                user = Object.assign(user, data);
                this.changeState('verifyContact', user);
            }
        });
    }

    error(err) {
        logger.debug(err);

        let msg = '';
        if (typeof err === 'string') {
            msg = err;
        } else if (err.message) {
            msg = err.message;
        } else {
            msg = JSON.stringify(err);
        }

        Toast.show({
          text: msg,
          buttonText: 'Close',
          duration: 10000,
          type: 'info',
        });
    }

    render() {
        if (!this._validAuthStates.includes(this.props.authState)) {
            this._isHidden = true;
            return null;
        }

        if (this._isHidden) {
            const { track } = this.props;
            if (track) track();
        }
        this._isHidden = false;

        return this.showComponent(this.props.theme || AmplifyTheme);
    }

    showComponent(theme) {
        throw 'You must implement showComponent(theme) and don\'t forget to set this._validAuthStates.';
    }
}
