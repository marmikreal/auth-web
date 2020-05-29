import React from 'react';
import { Form, Col, Button, Image } from 'react-bootstrap';
import history from './../../../lib/history';
import './SignUp.scss';
import logo from './../../../assets/img/inxt-logo-black.svg';

interface Props {}
interface State {
    firstName: string,
    lastName: string,
    email: string
    container: JSX.Element
    isValid: Boolean
}

class SignUp extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            container: this.renderSignUpContainer(),
            isValid: false
        };
    }

    handleFirstNameChange(e: any) {
        this.setState({ firstName: e.target.value });
    }

    handleLastNameChange(e: any) {
        this.setState({ lastName: e.target.value });
    }

    handleEmailChange(e: any) {
        this.setState({ email: e.target.value });
    }

    renderHeaderButtons(): JSX.Element {
        return(
            <div>
                <p className="container-title">
                    <Image
                        src={logo}
                        height={50}
                        width={150} />
                </p>

                <div className="menu-box">
                    <Button variant="dark" className='off __signin-btn' onClick={(e: any) => {
                        e.preventDefault();
                        history.push('/signin');
                    }}>Sign in</Button>

                    <Button variant="dark" className='on __signup-btn' onClick={(e: any) => {
                        e.preventDefault();
                        history.push('/signup');
                    }}>Create account</Button>
                </div>
            </div>
        );
    }

    renderPrivacyContainer(): JSX.Element {   
        return(
            <div>
                <p className="container-title">Internxt Security</p>
                <p className="privacy-disclaimer">Due to the secure nature of Internxt, we do not store your password. That means that if you ever forget it, you will not be able to access your account. With us, you're the only owner of your data. We strongly suggest you to:</p>
                <ul className="privacy-remainders">
                    <li>Store your Password. Keep it safe and secure.</li>
                    <li>Keep an offline backup of your password.</li>
                </ul>
                
                <Form onSubmit={(e: any) => {
                    e.preventDefault();
                }}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="name">
                            <Button className="btn-block off" onClick={(e: any) => {
                                e.preventDefault();
                                this.setState({
                                    container: this.renderSignUpContainer()
                                });
                            }}>Back</Button>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Button variant="dark" className="btn-block on" type="submit" autoFocus onClick={() => {
                                this.setState({
                                    container: this.renderConfirmPasswordContainer()
                                });
                            }}>Continue</Button>
                        </Form.Group>
                    </Form.Row>

                </Form>
            </div>
        );
    }

    renderConfirmPasswordContainer(): JSX.Element {
        return(
            <div>
               {this.renderHeaderButtons()}
            
                <Form className="form-register" onSubmit={(e: any) => {
                    e.preventDefault();
                }}>
                    <Form.Row>
                        <Form.Control type="hidden" name="username" autoComplete="username" value={''} />
                        <Form.Group as={Col} controlId="password">
                            <Form.Control type="password" required placeholder="Password" autoComplete="new-password" onChange={() => {}} autoFocus />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="confirmPassword">
                            <Form.Control type="password" required placeholder="Confirm password" autoComplete="confirm-password" onChange={() => {}} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="form-register-submit">
                        <Form.Group as={Col}>
                            <Button className="btn-block off" onClick={(e: any) => {
                                e.preventDefault();
                                this.setState({
                                    container: this.renderPrivacyContainer()
                                });
                            }}>Back</Button>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Button variant="dark" className="btn-block on" type="submit" onClick={() => {
                                 this.setState({
                                    container: this.renderConfirmActivationContainer()
                                });
                            }}>Continue</Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            
            </div>
        );
    }

    renderConfirmActivationContainer(): JSX.Element {
        return(
            <div>
                <p className="container-title">Activation Email</p>
                <p className="privacy-disclaimer">Please check your email and follow the instructions to activate your account so you can start using Internxt services.</p>
                <ul className="privacy-remainders" style={{ paddingTop: '20px' }}>By creating an account, you are agreeing to our Terms &amp; Conditions and Privacy Policy</ul>
                <Button variant="dark" className="btn-block on" onClick={() => {
                    
                }}>Re-send activation email</Button>
            </div>
        );
    }

    isValidForm(): Boolean {
        let isValid = true;
        console.log('validating...');

        if (!this.state) return false;

        if (this.state.firstName === '' || this.state.lastName === '') {
            isValid = false;
        }

        return isValid;
    }

    renderSignUpContainer(): JSX.Element {
        const isValid = this.isValidForm();
        return(
            <div>
                {this.renderHeaderButtons()}
                
                <Form className="form-register" onSubmit={(e: any) => {
                    e.preventDefault();

                    this.setState({
                        container: this.renderPrivacyContainer()
                    });
                }}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="firstName">
                            <Form.Control placeholder="First name" required autoComplete="firstname" value={this.state && this.state.firstName} onChange={this.handleFirstNameChange.bind(this)} autoFocus />
                        </Form.Group>
                        <Form.Group as={Col} controlId="lastName">
                            <Form.Control placeholder="Last name" required autoComplete="lastname" value={this.state && this.state.lastName} onChange={this.handleLastNameChange.bind(this)} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="email">
                            <Form.Control placeholder="Email address" type="email" required autoComplete="email" value={this.state && this.state.email} onChange={this.handleEmailChange.bind(this)} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row className="form-register-submit">
                        <Form.Group as={Col}>
                            <Button variant="dark" className="on btn-block" disabled={false} type="submit">Continue</Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </div>
        );
    }

    render(): JSX.Element {
        return this.state.container;
    }
}

export default SignUp;