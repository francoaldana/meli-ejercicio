import React, { Component } from 'react';
import Utils from "../utils";
import './css/App.css';
import './css/custom.css';

import {
  Container, Row, Col, Form, Button,
  FormGroup, FormText, Label, Input, FormFeedback
} from 'reactstrap';

class App extends Component {
  constructor(props) {
    super(props);
      this.state = {
        'ipaddress': '',
        validate: {
          ipaddressState: '',
        }
      }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setIPAddressState(e) {
    const { validate } = this.state

    if(!Utils.isValidIPAddress(e.target.value)){
      validate.ipaddressState = 'has-danger'
    }else{
      validate.ipaddressState = 'has-success'
    }

    this.setState({ validate })
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    let ipaddress = data.get('ipaddress');

    if(!Utils.isValidIPAddress(ipaddress)){
      console.log('ip invalida');
    } else {
      console.log('ip valida');
    }

  }

  handleChange = async (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [ name ]: value,
    });
  }

  render() {
    const { ipaddress } = this.state;

    return (
      <Container className="App">
        <Form className="form" onSubmit={ (e) => this.handleSubmit(e) }>
          <h2>Búsqueda de Dirección IP</h2>
          <Col>
            <FormGroup>
              <Label>Dirección IP</Label>
              <Input
                type="ipaddress"
                name="ipaddress"
                id="ipaddress"
                placeholder="192.168.1.1"
                value={ ipaddress }
                valid={ this.state.validate.ipaddressState === 'has-success' }
                invalid={ this.state.validate.ipaddressState === 'has-danger' }
                onChange={ (e) => {
                            this.setIPAddressState(e)
                            this.handleChange(e)
                          } }
              />
              <FormFeedback valid>
                La dirección IP es válida y se puede buscar.
              </FormFeedback>
              <FormFeedback>
                La dirección IP no es válida o es privada. No se puede tener informacion.
              </FormFeedback>
              <FormText>Ingresa una dirección IP para obtener información detallada</FormText>
              <br/>
            </FormGroup>
          </Col>
          <Col>
          <Button outline color="primary" disabled={ this.state.validate.ipaddressState === 'has-danger' }>Buscar</Button>
          </Col>
        </Form>
      </Container>
    );
  }
}

export default App;
