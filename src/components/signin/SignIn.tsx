import React from 'react';
import { Form, Button, Col, Image } from 'react-bootstrap';
import { encryptText, decryptTextWithKey, decryptText, passToHash } from '../../lib/utils';
import { isMobile, isAndroid, isIOS } from 'react-device-detect';
import { toast } from 'react-toastify';

import events from '../../lib/pubsub';
import validator from '../../lib/validator';
import history from '../../lib/history';
import './SignIn.scss';
import logo from '../../assets/img/inxt-logo-black.svg';
import { getHeaders } from '../../lib/auth';
import 'react-toastify/dist/ReactToastify.css';

interface LoginProps {
    email?: string
    password?: string
    handleKeySaved?: (user: any) => void
    isAuthenticated: Boolean
}
interface LoginState {
    email: string,
    password: string
    isAuthenticated: Boolean
    token: string
    user: any
    showTwoFactor: Boolean
    twoFactorCode: string
    isTeam: Boolean
}

class SignIn extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);

        this.state = {
            email: '',
            password: '',
            isAuthenticated: false,
            token: "",
            user: {},
            showTwoFactor: false,
            twoFactorCode: '',
            isTeam: false
          }
    }

    componentDidMount() {
      if (isMobile) {
        if (isAndroid) {
          window.location.href = "https://play.google.com/store/apps/details?id=com.internxt.cloud";
        } else if (isIOS) {
          window.location.href = "https://itunes.apple.com/us/app/x-cloud-secure-file-storage/id1465869889";
        }
      }
    
      // Check if recent login is passed and redirect user to Internxt Drive
      const mnemonic = localStorage.getItem('xMnemonic');
      const user = JSON.parse(localStorage.getItem('xUser') || '{}');
    
      if (user && mnemonic && this.props.handleKeySaved) {
        this.props.handleKeySaved(user)
        history.push('/app')
      }
    }

    componentDidUpdate() {
        if (this.state.isAuthenticated && this.state.token && this.state.user) {
          const mnemonic = localStorage.getItem('xMnemonic');
          if (mnemonic) {
            history.push('/app')
          }
        }
    }

    componentWillUnmount() {
        events.publish('/show/recovery', 'invisible');
    }

    componentWillMount() {
        events.publish('/show/recovery', 'visible');
    }

    handleEmailChange(e: any) {
        this.setState({ email: e.target.value });
    }

    handlePasswordChange(e: any) {
        this.setState({ password: e.target.value });
    }

    isValidForm(): Boolean {
        let isValid = true;

        if (this.state.email.length < 5 || !validator.isValidEmail(this.state.email)) isValid = false;
        if (this.state.password.length < 1) isValid = false;
        return isValid;
    }  
    
    validateLoginForm = () => {
        let isValid = true;
    
        // Email validation
        if (this.state.email.length < 5 || !this.validateEmail(this.state.email)) isValid = false;
        // Pass length check
        if (this.state.password.length < 1) isValid = false;
    
        return isValid;
    }
    
    validate2FA = () => {
        let pattern = /^\d{3}(\s+)?\d{3}$/
        return pattern.test(this.state.twoFactorCode);
    }
    
    validateEmail = (email: string) => {
        // eslint-disable-next-line no-control-regex
        let emailPattern = /^((?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*"))@((?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))$/
        return emailPattern.test(email.toLowerCase());
    }
    
    handleChangeEmail = (event: any) => {
        this.setState({
          email: event.target.value,
        });
    }

    handleChangePass = (event: any) => {
        this.setState({
          password: event.target.value,
        });
    }

    check2FANeeded = () => {
        fetch('/api/login', {
          method: 'POST',
          headers: getHeaders(true, true),
          body: JSON.stringify({ email: this.state.email })
        }).then(async res => {
    
          const data = await res.json();
    
          if (res.status !== 200) {
            throw new Error(data.error ? data.error : 'Login error');
          }
    
          return data;
    
        }).then(res => {
          if (!res.tfa) {
            this.doLogin();
          } else {
            this.setState({ showTwoFactor: true });
          }
        }).catch(err => {
          if (err.message.includes('not activated') && this.validateEmail(this.state.email)) {
            history.push(`/activate/${this.state.email}`);
          } else {
            toast.warn(`"${err}"`);
          }
        });
    }

    doLogin = () => {
        // Proceed with submit
        fetch("/api/login", {
          method: "post",
          headers: getHeaders(true, false),
          body: JSON.stringify({ email: this.state.email })
        }).then(response => {
          if (response.status === 200) {
            // Manage credentials verification
            response.json().then((body) => {
              // Check password
              const salt = decryptText(body.sKey);
              const hashObj = passToHash({ password: this.state.password, salt });
              const encPass = encryptText(hashObj.hash);
    
              fetch("/api/access", {
                method: "post",
                headers: getHeaders(true, false),
                body: JSON.stringify({
                  email: this.state.email,
                  password: encPass,
                  tfa: this.state.twoFactorCode
                })
              }).then(async res => {
                return { res, data: await res.json() };
              }).then(res => {/*
                console.log("ACCESS RESPONSE: ", res.data); //debug
                if (res.res.status !== 200) {
                  throw new Error(res.data.error ? res.data.error : res.data);
                }
                var data = res.data;
                // Manage succesfull login
                const user = {
                  userId: data.user.userId,
                  email: this.state.email,
                  mnemonic: data.user.mnemonic ? decryptTextWithKey(data.user.mnemonic, this.state.password) : null,
                  root_folder_id: data.user.root_folder_id,
                  storeMnemonic: data.user.storeMnemonic,
                  name: data.user.name,
                  lastname: data.user.lastname,
                  uuid: data.user.uuid,
                  credit: data.user.credit
                };           
                
                if (this.props.handleKeySaved) {
                  this.props.handleKeySaved(user)
                }
    
                if (data.userTeam && data.userTeam.isActivated) {
                  const team = {
                    user: data.userTeam.bridge_user,
                    password: data.userTeam.bridge_password,
                    mnemonic: data.userTeam.bridge_mnemonic,
                    admin: data.userTeam.admin,
                    root_folder_id: data.userTeam.root_folder_id,
                    rol: data.teamRol
                  }
                  localStorage.setItem('xTeam', JSON.stringify(team));
                }
                
                localStorage.setItem('xToken', data.token);
                localStorage.setItem('xMnemonic', user.mnemonic);
                localStorage.setItem('xUser', JSON.stringify(user));
    
                this.setState({
                  isAuthenticated: true,
                  token: data.token,
                  user: user,
                  isTeam: false
                });
                /*
                analytics.identify(data.user.uuid, {
                  event: 'user-signup',
                  email: data.user.email
                })*/
              }).catch(err => {
                toast.warn(`"${err.error ? err.error : err}"`);
              });
            });
          } else if (response.status === 400) {
            // Manage other cases:
            // username / password do not match, user activation required...
            response.json().then((body) => {
              toast.warn(body.error);
            });
          } else {
            // Manage user does not exist
            toast.warn("This account doesn't exists");
          }
        })
          .catch(err => {
            console.error("Login error. " + err)
            toast.warn('Login error')
          });
      }

    render(): JSX.Element {
        return(
            <div>
                <p className="container-title">
                    <Image
                        src={logo}
                        height={50}
                        width={150} />
                </p>

                <div className="menu-box">
                    <Button variant="dark" className='on __signin-btn' onClick={(e: any) => {
                        e.preventDefault();
                        history.push('/login');
                    }}>Sign in</Button>

                    <Button variant="dark" className='off __signup-btn' onClick={(e: any) => {
                        e.preventDefault();
                        history.push('/new');
                    }}>Create account</Button>
                </div>
                
                <Form className="form-register" onSubmit={(e: any) => {
                    e.preventDefault();
                }}>

                    <Form.Row>
                        <Form.Group as={Col} controlId="email">
                            <Form.Control placeholder="Email address" required type="email" name="email" autoComplete="username" value={this.state.email} autoFocus onChange={this.handleChangeEmail.bind(this)} />
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} controlId="password">
                            <Form.Control placeholder="Password" required type="password" name="password" autoComplete="current-password" value={this.state.password} onChange={this.handleChangePass.bind(this)}/>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row className="form-register-submit">
                        <Form.Group as={Col}>
                            <Button variant="dark" className="on btn-block" disabled={!this.isValidForm()} type="submit">Sign in</Button>
                        </Form.Group>
                    </Form.Row>
                </Form>
            </div>
        );
    }
}

export default SignIn;