import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';

import api from '../../services/api';

import { Form, SubmitButton, List, ErrorMessage } from './styles';
import Container from '../../components/container/index';

export default class Main extends Component {
  state = {
    newRepo: '',
    repos: [],
    loading: false,
    errorMessage: '',
  };

  componentDidMount() {
    const repos = localStorage.getItem('repos');

    if (repos) {
      this.setState({ repos: JSON.parse(repos) });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { repos } = this.state;

    if (prevState.repos !== repos) {
      localStorage.setItem('repos', JSON.stringify(repos));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value, errorMessage: '' });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: true });

    const { newRepo, repos } = this.state;

    const repoExists = repos.filter(repo => {
      return repo.name === newRepo;
    });

    if (repoExists.length) {
      this.setState({
        loading: false,
        errorMessage: 'Repository already added.',
      });

      return;
    }

    try {
      const res = await api.get(`/repos/${newRepo}`);

      const data = { name: res.data.full_name };

      this.setState({
        repos: [...repos, data],
        newRepo: '',
        loading: false,
      });
    } catch (err) {
      this.setState({
        loading: false,
        errorMessage: 'Repository not found.',
      });
    }
  };

  render() {
    const { newRepo, loading, repos, errorMessage } = this.state;

    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositories
        </h1>

        <Form
          onSubmit={this.handleSubmit}
          isError={errorMessage ? true : false}
        >
          <input
            type="text"
            placeholder="Add a repository"
            onChange={this.handleInputChange}
            value={newRepo}
          />

          <SubmitButton isLoading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>

        <ErrorMessage>{errorMessage}</ErrorMessage>

        <List>
          {repos.map(repo => (
            <li key={repo.name}>
              {repo.name}{' '}
              <Link to={`/repository/${encodeURIComponent(repo.name)}`}>
                Details
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
