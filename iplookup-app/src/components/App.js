import React, { Component } from 'react';
import './css/App.css';
import './css/custom.css';
import Api from '../api';
import Utils from '../utils';
import Loader from 'react-loader-spinner'
import { ToastContainer } from 'react-toastr';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';

import {
  Container, Row, Col, Form, Button,
  FormGroup, FormText, Label, Input, FormFeedback,
  Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink, Media,
  ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText
} from 'reactstrap';

class App extends Component {

  constructor(props) {
    super(props);
      this.state = {
        ipaddress: '',
        validate: {
          ipaddressState: '',
        },
        collapsed: true,
        ipSearched: null,
        ipInfoFetched: null,
        countryInfoFetched: null,
        currencyInfoFetched:null,
        searchStatus: null
      }
  }

  setIPAddressState = (event) => {
    const {
      validate
    } = this.state

    if (!Utils.isValidIPAddress(event.target.value)) {
      validate.ipaddressState = 'has-danger'
    } else {
      validate.ipaddressState = 'has-success'
    }

    this.setState({
      validate
    })
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.target);
    let ipaddress = data.get('ipaddress');

    if (!Utils.isValidIPAddress(ipaddress)) {
      this.setState({
        searchStatus: "error",
        ipInfoFetched: null,
        countryInfoFetched: null,
        currencyInfoFetched: null
      });
    } else {
      this.setState({
        searchStatus: "loading",
        ipInfoFetched: null,
        countryInfoFetched: null,
        currencyInfoFetched: null,
        ipSearched: ipaddress
      });

      let currencyInfoFetched = null;
      let ipInfoFetched = null;
      let countryInfoFetched = null;

      try {
        ipInfoFetched = await Api.getIpAddress(ipaddress);
        countryInfoFetched = await Api.getCountryInfo(ipInfoFetched.countryCode3);
        currencyInfoFetched = await Api.getCountryCurrency(countryInfoFetched.currencies);
        //console.log(countryInfoFetched.timezones);
        //console.log(Utils.getTimeByTimezone(countryInfoFetched.timezones));

        this.setState({
          ipSearched: ipaddress,
          ipInfoFetched: ipInfoFetched,
          countryInfoFetched: countryInfoFetched,
          currencyInfoFetched: currencyInfoFetched,
          searchStatus: "success"
        });
      } catch (error) {
        let errorMessage;
        console.log('ERROR - ErrorType: ' + error.message);

        switch (error.message) {
          case 'Failed to fetch':
            errorMessage = 'No se pudo completar la búsqueda de la dirección IP. Una API no funciona correctamente.';
          break;
          default:
            errorMessage = 'No se pudo completar la búsqueda de la dirección IP. Problema interno.';
        }

        this.refs.container.error(
          <strong>Hubo un error al obtener la respuesta</strong>,
          <em>{errorMessage}</em>
        );

        this.setState({
          ipSearched: null,
          ipInfoFetched: null,
          countryInfoFetched: null,
          currencyInfoFetched: null,
          searchStatus: "error"
        });
      }


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

  toggleNavbar = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    const { ipaddress } = this.state;

    return (
      <React.Fragment>
        <ToastContainer ref="container"
        className="toast-bottom-right toastContainerC"/>
        <div>
          <Navbar color="light" light expand="md">
            <NavbarBrand href="/">IPLookup / MeLi</NavbarBrand>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse isOpen={!this.state.collapsed} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink href="https://github.com/francoaldana/meli-ejercicio">GitHub</NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </Navbar>
        </div>

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
            <Button outline color="primary" disabled={ this.state.validate.ipaddressState === 'has-danger' || this.state.searchStatus === "loading" }>Buscar</Button>
            </Col>
          </Form>

          {this.state.searchStatus === "loading" &&
          <Row className="resultContainer">
              <Col className="resultBox">
                <div className="loadingSpinner">
                  <Loader
                     type="Ball-Triangle"
                     color="#21c1ff"
                     height="50"
                     width="50"
                  />
                  <br/>
                  <h4>Obteniendo resultados</h4>
                </div>
              </Col>
          </Row>
          }

          {this.state.searchStatus === "success" &&
          <div>
            <Row className="resultContainer">
              <Col className="resultBox">

              <Media>
                <Media left href="#">
                  <Media object src={this.state.countryInfoFetched.flag} alt="Generic placeholder image" />
                </Media>
                <Media body>
                  <Media heading>
                    Resultados de búsqueda
                  </Media>
                  La IP <b>{this.state.ipSearched}</b> corresponde al país {this.state.ipInfoFetched.countryName} (ISO: {this.state.ipInfoFetched.countryCode3})
                </Media>
              </Media>
              <ListGroup>
                <ListGroupItem>
                  <ListGroupItemHeading>Idiomas oficiales</ListGroupItemHeading>
                  <ListGroupItemText>
                  Los idiomas oficiales del país son <b>{this.state.countryInfoFetched.languages.map((language)=> `${language.nativeName} (${language.name} - ${language.iso639_1})`)}</b>
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>Horario actual</ListGroupItemHeading>
                  <ListGroupItemText>
                  El horario actual es <b>{this.state.countryInfoFetched.timezones.map((timezone)=>`${timezone.time}(${timezone.utc}), `)}</b>
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>Moneda local</ListGroupItemHeading>
                  <ListGroupItemText>
                  La moneda local es el <b>{this.state.countryInfoFetched.currencies[0].name} ({this.state.countryInfoFetched.currencies[0].code}).</b>
                  <br/>
                  El cambio es de <b>1 {this.state.countryInfoFetched.currencies[0].code} = {this.state.currencyInfoFetched.currencyRate} USD</b>
                  </ListGroupItemText>
                </ListGroupItem>
                <ListGroupItem>
                  <ListGroupItemHeading>Distancia estimada desde Bs As</ListGroupItemHeading>
                  <ListGroupItemText>
                  La distancia estimada desde Buenos Aires a {this.state.ipInfoFetched.countryName} es de <b>{this.state.countryInfoFetched.distance}km</b>.
                  </ListGroupItemText>
                </ListGroupItem>
              </ListGroup>
              </Col>
              <Col className="resultBox mapsContainer" md="4">
                <Map
                  google={this.props.google}
                  style={{width: '100%', height:'100%'}}
                  initialCenter={{
                    lat: this.state.countryInfoFetched.countryCoord[0],
                    lng: this.state.countryInfoFetched.countryCoord[1]
                  }}
                  zoom={5}
                >
                <Marker onClick={this.onMarkerClick} name={'Current location'} />
                </Map>
              </Col>
            </Row>
            </div>
          }

        </Container>
      </React.Fragment>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ("AIzaSyDXkafXzHd-ztfxpLTbAGNNWfBDSnvEP4I")
})(App)
