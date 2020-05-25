import React from 'react';
import { Container, Form, Button, Col } from 'react-bootstrap';
import './Auth.scss';

interface Props {}
interface State {
    email: string,
    password: string
}

class Auth extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };
    }

    render() {
        return(
            <Container fluid className="d-flex align-items-center">
                <div className="__auth-container">
                    <p className="container-title">Sign in to Internxt</p>

                    <div className="menu-box">
                        <Button className="on">Sign in</Button>
                        <Button className="off" onClick={(e: any) => {
                            e.preventDefault();

                            }}>Create account</Button>
                    </div>

                    <Form className="form-register" onSubmit={(e: any) => {
                        e.preventDefault();
                            
                        }}>

                        <Form.Row>
                            <Form.Group as={Col} controlId="email">
                            <Form.Control placeholder="Email address" required type="email" name="email" autoComplete="username" value={this.state.email} autoFocus />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="password">
                            <Form.Control placeholder="Password" required type="password" name="password" autoComplete="current-password" value={this.state.password} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row className="form-register-submit">
                            <Form.Group as={Col}>
                            <Button className="on btn-block" disabled={true} type="submit">Sign in</Button>
                            </Form.Group>
                        </Form.Row>
                    </Form>


                    {/* <div className="col-md-12 __footer-section">
                        Forgot yout password?
                    </div> */}
                </div>
            </Container>
        );
    }
}

export default Auth;