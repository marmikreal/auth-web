import * as React from 'react';
import { Form, Col, Button, Image } from 'react-bootstrap';
import { isMobile, isAndroid, isIOS } from 'react-device-detect';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './New.scss';
import history from '../../lib/history';
import logo from '../../assets/img/inxt-logo-black.svg';
import { getHeaders } from '../../lib/auth';
import { encryptText, encryptTextWithKey, passToHash } from '../../lib/utils';
import AesUtil from '../../lib/AesUtil';

const bip39 = require('bip39');

interface Props {
    match?: any
}

interface State {
    isAuthenticated?: Boolean
    register: any
    container: JSX.Element
    validated?: Boolean
    showModal: Boolean
    token?: string
    user?: any
}

class New extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        let isEmailParam = this.props.match.params.email && this.isValidEmail(this.props.match.params.email);

        this.state = {
            container: isEmailParam ? this.renderConfirmActivationContainer() : this.renderSignUpContainer(),
            register: {
                name: '',
                lastname: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            showModal: false
        };
    }

    componentDidMount() {
        if (isMobile) {
            if (isAndroid) {
                window.location.href = "https://play.google.com/store/apps/details?id=com.internxt.cloud";
            } else if (isIOS) {
                window.location.href = "https://itunes.apple.com/us/app/x-cloud-secure-file-storage/id1465869889";
            }
        }

        const xUser = JSON.parse(localStorage.getItem('xUser') || '{}');
        const xToken = localStorage.getItem('xToken');
        const mnemonic = localStorage.getItem('xMnemonic');
        const haveInfo = (xUser && xToken && mnemonic);

        if (this.state.isAuthenticated === true || haveInfo) {
            // TODO: Redirect to the referer application
        }
    }



    handleChangeRegister = (event: any) => {
        var registerState = this.state.register;
        registerState[event.target.id] = event.target.value;
        this.setState({ register: registerState });
    }

    readReferalCookie() {
        const cookie = document.cookie.match(/(^| )REFERRAL=([^;]+)/);
        return cookie ? cookie[2] : null;
    }

    isValidEmail(email: string) {
        let emailPattern = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*"))@((?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/;
        return emailPattern.test(email.toLowerCase());
    }


    isValidPassword(password: string) {
        let passwordPattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        return passwordPattern.test(password);
    }

    validateRegisterForm = () => {
        let isValid = true;

        if (!this.state.register.name || !this.state.register.lastname || !this.state.register.email) {
            return false;
        }

        // Name lenght check
        if (this.state.register.name.length < 1 && this.state.register.lastname.length < 1) isValid = false;
        // Email length check and validation
        if (this.state.register.email.length < 5 || !this.isValidEmail(this.state.register.email)) isValid = false;

        return isValid;

    }

    doRegister = () => {
        // Setup hash and salt 
        const hashObj = passToHash({ password: this.state.register.password });
        const encPass = encryptText(hashObj.hash);
        const encSalt = encryptText(hashObj.salt);
        // Setup mnemonic
        const mnemonic = bip39.generateMnemonic(256);
        const encMnemonic = encryptTextWithKey(mnemonic, this.state.register.password);

        /*
         //Generate keys
        const {privateKeyArmored, publicKeyArmored, revocationCertificate} = await openpgp.generateKey({
            userIds: [{  email: 'inxt@inxt.com' }], // you can pass multiple user IDs
            curve: 'ed25519',                                           // ECC curve name        // protects the private key
        });
        
        const encPrivateKey = AesUtil.encrypt(privateKeyArmored,this.state.register.password,false);
        const decKrey = AesUtil.decrypt(encPrivateKey,this.state.register.password);
        const codpublicKey = Buffer.from(publicKeyArmored).toString('base64');
        const decpublicKey = Buffer.from(codpublicKey).toString();
        const codrevocateKey = Buffer.from(revocationCertificate).toString('base64');
        */
      
        fetch("/register", {
            method: "post",
            headers: getHeaders(true, true),
            body: JSON.stringify({
                name: this.state.register.name,
                lastname: this.state.register.lastname,
                email: this.state.register.email,
                password: encPass,
                mnemonic: encMnemonic,
                salt: encSalt,
                referral: this.readReferalCookie()
                /*privateKey: encPrivateKey,
                publicKey: codpublicKey,
                revocationKey: codrevocateKey*/
            })
        }).then(response => {  
            /******************************************
            FLOW WILL BE REDIRECTED TO THE REFERER APP
            ******************************************/
            if (response.status === 200) {
                response.json().then((body) => {
                    // Manage succesfull register
                    const { token, user } = body;
                    localStorage.setItem('xToken', token);

                    // Clear form fields
                    this.setState({
                        register: {
                            name: '',
                            lastname: '',
                            email: this.state.register.email,
                            password: '',
                            confirmPassword: '',
                        },
                        validated: false,
                        showModal: true,
                        token,
                        user,
                        container: this.renderConfirmActivationContainer()
                    });
                });
            } else {
                response.json().then((body) => {
                    // Manage account already exists (error 400)
                    const { message } = body;
                    toast.warn(`"${message}"`);
                    this.setState({ validated: false });
                })
            }
        }).catch(err => {
            console.error("Register error", err);
        });

    }




    renderHeaderButtons(): JSX.Element {
        return (
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
                        history.push('/login');
                    }}>Sign in</Button>

                    <Button variant="dark" className='on __signup-btn' onClick={(e: any) => {
                        e.preventDefault();
                        history.push('/new');
                    }}>Create account</Button>
                </div>
            </div>
        );
    }

    renderPrivacyContainer(): JSX.Element {
        return (
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
        return (
            <div>
                {this.renderHeaderButtons()}

                <Form className="form-register" onSubmit={(e: any) => {
                    e.preventDefault();
                }}>
                    <Form.Row>
                        <Form.Control type="hidden" name="username" autoComplete="username" value={''} />
                        <Form.Group as={Col} controlId="password">
                            <Form.Control type="password" required placeholder="Password" autoComplete="new-password" onChange={this.handleChangeRegister.bind(this)} autoFocus />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="confirmPassword">
                            <Form.Control type="password" required placeholder="Confirm password" autoComplete="confirm-password" onChange={this.handleChangeRegister.bind(this)} />
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
                                this.doRegister();
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
        return (
            <div>
                <p className="container-title">Activation Email</p>
                <p className="privacy-disclaimer">Please check your email and follow the instructions to activate your account so you can start using Internxt.</p>
                <ul className="privacy-remainders" style={{ paddingTop: '20px' }}>By creating an account, you are agreeing to our Terms &amp; Conditions and Privacy Policy</ul>
                <Button variant="dark" className="btn-block on" onClick={() => {

                }}>Re-send activation email</Button>
            </div>
        );
    }

    renderSignUpContainer(): JSX.Element {
        //const isValid = this.validateRegisterForm();
        return (
            <div>
                {this.renderHeaderButtons()}

                <Form className="form-register" onSubmit={(e: any) => {
                    e.preventDefault();

                    this.setState({
                        container: this.renderPrivacyContainer()
                    });
                }}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="name">
                            <Form.Control placeholder="First name" required autoComplete="firstname" value={this.state && this.state.register.name} onChange={this.handleChangeRegister.bind(this)} autoFocus />
                        </Form.Group>
                        <Form.Group as={Col} controlId="lastname">
                            <Form.Control placeholder="Last name" required autoComplete="lastname" value={this.state && this.state.register.lastname} onChange={this.handleChangeRegister.bind(this)} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="email">
                            <Form.Control placeholder="Email address" type="email" required autoComplete="email" value={this.state && this.state.register.email} onChange={this.handleChangeRegister.bind(this)} />
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

export default New;