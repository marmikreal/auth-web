import React from 'react';
import { Container, Button } from 'react-bootstrap';
import history from './../../lib/history';
import './Auth.scss';

interface Props {
    title: string
    internalForm: JSX.Element
    statusBtnSignIn: string,
    statusBtnSignUp: string,
    recoveryPasswordVisibility: string
}
interface State {
    title: string,
    email: string,
    password: string,
    internalForm: JSX.Element,
    statusBtnSignIn: string,
    statusBtnSignUp: string,
    recoveryPasswordVisibility: string
}

class Auth extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            title: this.props.title,
            email: '',
            password: '',
            internalForm: this.props.internalForm,
            statusBtnSignIn: this.props.statusBtnSignIn,
            statusBtnSignUp: this.props.statusBtnSignUp,
            recoveryPasswordVisibility: this.props.recoveryPasswordVisibility
        };
    }

    static getDerivedStateFromProps(nextProps: any, prevState: any) {
        if (nextProps.internalForm !== prevState.internalForm) {
            return {
                title: nextProps.title,
                internalForm: nextProps.internalForm,
                statusBtnSignIn: nextProps.statusBtnSignIn,
                statusBtnSignUp: nextProps.statusBtnSignUp,
                recoveryPasswordVisibility: nextProps.recoveryPasswordVisibility
            }
        } else {
            return null;
        }
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (prevState.internalForm !== this.state.internalForm) {
            this.setState({
                title: prevState.title,
                internalForm: prevState.internalForm,
                statusBtnSignIn: prevState.statusBtnSignIn,
                statusBtnSignUp: prevState.statusBtnSignUp,
                recoveryPasswordVisibility: prevState.recoveryPasswordVisibility
            });
        }
    }

    render() {
        return (
            <Container fluid className="__auth-main-container">
                <div className="__auth-container-sections">
                    <div className="__auth-container">
                        <p className="container-title">{this.state.title}</p>

                        <div className="menu-box">
                            <Button className={this.state.statusBtnSignIn} onClick={(e: any) => {
                                e.preventDefault();
                                history.push('/signin');
                            }}>Sign in</Button>

                            <Button className={this.state.statusBtnSignUp} onClick={(e: any) => {
                                e.preventDefault();
                                history.push('/signup');
                            }}>Create account</Button>
                        </div>

                        {this.state.internalForm}
                    </div>
                    
                    <div className={this.state.recoveryPasswordVisibility} onClick={(e: any) => {
                        e.preventDefault();
                        history.push('/recovery');
                    }}>Forgot your password?</div>
                </div>
            </Container>
        );
    }
}

export default Auth;