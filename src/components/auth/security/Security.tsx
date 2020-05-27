import React from 'react';
import { Container, Button, Form, Col } from 'react-bootstrap';
import history from '../../../lib/history';
import './Recovery.scss';

interface Props {}
interface State {}

class Recovery extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    render() {
        return(
            <Container fluid className="__auth-main-container">
                <div className="__auth-container-sections">
                    <div className="__auth-container">
                        {/* <p className="logo"><img src={logo} alt="Logo" /></p> */}
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
                                    <button className="btn-block off" onClick={(e: any) => {
                                        e.preventDefault();
                                        history.push('/signup');
                                    }}>Back</button>
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <button className="btn-block on" type="submit" autoFocus>Continue</button>
                                </Form.Group>
                            </Form.Row>

                        </Form>
                    </div>
                </div>
            </Container>
        );
    }
}

export default Recovery;