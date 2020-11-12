import React from 'react';
import './Auth.scss';

interface Props {
    internalForm: JSX.Element
}
interface State {
    email: string,
    password: string,
    internalForm: JSX.Element
}

class Auth extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            internalForm: this.props.internalForm
        };
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any): any {
        if (nextProps.internalForm !== prevState.internalForm) {
            return {
                internalForm: nextProps.internalForm
            }
        } else {
            return null;
        }
    }

    componentDidUpdate(prevProps: any, prevState: any): void {
        if (prevState.internalForm !== this.state.internalForm) {
            this.setState({
                internalForm: prevState.internalForm
            });
        }
    }

    render(): JSX.Element {
        return (
            <div>
                {this.state.internalForm}
            </div>
        );
    }
}

export default Auth;