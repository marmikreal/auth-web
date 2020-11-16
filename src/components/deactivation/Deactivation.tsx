import React from 'react';
import { Container, Form, Col, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { isMobile } from 'react-device-detect'
import history from '../../lib/history';
import { getHeaders } from '../../lib/auth'
import './Deactivation.scss';

interface Props { 
    match?: any
}
interface State {
    container: JSX.Element
    email: string
    token: string
    result: JSX.Element
    errorReason: string
}

class Deactivation extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            container: this.renderRecoveryContainer(),
            email: '',
            token: this.props.match.params.token,
            result: this.renderConfirmDeactivation(),
            errorReason: ''
        };
    }

    componentDidUpdate() {
        if (this.IsValidToken(this.state.token)) {
            this.ConfirmDeactivateUser(this.state.token);
        } else {

            if (!isMobile) {
                toast.warn('Invalid token');
                //history.push('/');
            } else {
                this.setState({ result: this.invalidDeactivationToken() });
            }
        }
    }

    handleChangeEmail = (event: any) => {
        this.setState({
          email: event.target.value,
        });
    }

    IsValidToken = (token: string) => {
        return /^[a-z0-9]{512}$/.test(token);
    }

    ClearAndRedirect = () => {
        console.log('Clear and redirect')
        localStorage.clear();

        if (!isMobile) {
            toast.info('Your account has been deactivated');
            history.push('/');
        } else {
            this.setState({ result: this.confirmDeactivation() });
        }
    }

    sendDeactivationEmail = (email: string) => {
        fetch(`/reset/${email}`, {
            method: 'GET',
            headers: getHeaders(false, false)
        }).then(() => {
            this.setState({ container: this.renderConfirmDeactivation() });
        }).catch(err => {
            toast.warn('Error deactivating account');
            console.log(err);
        });
    }

    resendDeactivationEmail = (email: string) => {
        console.log("HOLA")
        fetch(`/resend/${email}`, {
            method: 'GET',
            headers: getHeaders(false, false)
        }).then(() => {
            this.setState({ container: this.renderConfirmDeactivation() });
        }).catch(err => {
            toast.warn('Error deactivating account');
            console.log(err);
        });
    }

    ConfirmDeactivateUser = (token: string) => {
        axios.get('/confirmDeactivation/' + token).then(res => {
            console.log('All is ok') //debug
            this.ClearAndRedirect()
        }).catch(err => {
            if (!isMobile) {
                toast.warn('Invalid token');
                history.push('/');
            } else {
                this.setState({ result: this.invalidDeactivationToken() });
            }
        });
    }



    renderConfirmDeactivation(): JSX.Element {
        return (
            <div>
                <p className="container-title">Deactivation Email</p>
                <p className="privacy-disclaimer">Please check your email and follow the instructions to deactivate your account so you can start using Internxt again.</p>
                <div className="privacy-remainders" style={{ paddingTop: '20px' }}>Once you deactivate your account, you will be able to sign up using the same email address. Please store your password somewhere safe. With Internxt, only you are the true owner of your data. With great power there must also come great responsibility.</div>

                <Button variant="dark" className="btn-block on" onClick={(e: any) => {
                    this.resendDeactivationEmail(this.state.email);
                    e.preventDefault();
                }}>Re-send deactivation email</Button>

            </div>
        );
    }

    renderRecoveryContainer(): JSX.Element {
        return (
            <div>
                <p className="container-title">Internxt Security</p>
                <p className="privacy-disclaimer">As specified during the sign up process, Internxt does not know your password, and thus, that way, only you can decrypt your account and its data. For that reason, if you forget your password, we can't restore your account. What we can do, however, is to <span style={{ fontWeight: 'bold' }}>delete your account and erase all its files</span>, so that you can sign up again. Please enter your email below so that we can process the account removal.</p>

                <Form onSubmit={(e: any) => {
                    e.preventDefault();
                }}>
                    <Form.Row style={{ paddingTop: '5px' }}>
                        <Form.Group as={Col} controlId="email">
                            <Form.Control placeholder="Email address" type="email" required autoComplete="off" onChange={this.handleChangeEmail.bind(this)} autoFocus />
                        </Form.Group>
                    </Form.Row>

                    <Form.Row className="form-register-submit" style={{ marginTop: '15px' }}>
                        <Form.Group as={Col} style={{ paddingRight: 20 }}>
                            <Button className="btn-block off" onClick={(e: any) => {
                                history.push('/login');
                                e.preventDefault();
                            }}>Back</Button>
                        </Form.Group>

                        <Form.Group as={Col} style={{ paddingLeft: 20 }}>
                            <Button variant="dark" className="on btn-block" disabled={false} type="submit" onClick={() => {
                                this.sendDeactivationEmail(this.state.email);
                                this.setState({
                                    container: this.renderConfirmDeactivation()
                                });
                            }}>Continue</Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </div>
        );
    }

    confirmDeactivation() {
        return <p>Your account has been deactivated</p>
    }

    invalidDeactivationToken() {
        return <div>
            <p>Invalid token</p>
        </div>;
    }

    render() {
        return (
            <div>
                {this.state.container}
            </div>
        );
    }
}

export default Deactivation;