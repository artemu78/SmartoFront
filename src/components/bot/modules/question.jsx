import React, { Component } from 'react';
const { connect } = require('react-redux');
const utils = require('./../../../utils.js');

class QuestionModule extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.handleResponse = this.handleResponse.bind(this);
  }

  send() {
    let add = { l: utils.getCookie('l'), b: this.props.bot.id };
    let obj = Object.assign({}, this.state, add);
    let str = JSON.stringify(obj);
    utils.sendRequest(str, this.handleResponse, 'data/save_data.php');
  }

  handleResponse(response) {
    window.webix.message({
      text: 'Company data saved',
      type: 'info',
      expire: 5000,
      id: 'message1'
    });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  render() {
    return [
      <aside key='0'>
        <div
          class='modal fade'
          id='editModal'
          tabindex='-1'
          role='dialog'
          aria-labelledby='editModalLabel'
        >
          <div class='modal-dialog' role='document'>
            <div class='modal-content'>
              <div class='modal-header'>
                <button type='button' class='close' data-dismiss='modal' aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
                <h4 class='modal-title' id='editModalLabel'>
                  Редактирование
                </h4>
              </div>

              <div class='modal-body'>
                <form>
                  <div class='form-group'>
                    <label for='edit-name' class='control-label'>
                      Название:
                    </label>
                    <input type='text' class='form-control' id='edit-name' />
                  </div>
                </form>
              </div>

              <div class='modal-footer'>
                <button type='button' class='btn btn-default' data-dismiss='modal'>
                  Закрыть
                </button>
                <button
                  type='button'
                  id='modalSaveBtn'
                  data-dismiss='modal'
                  class='btn btn-success'
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>,

      <div class='container-fluid'>
        <div class='row'>
          <main class='col-sm-9 col-md-10 main'>
            <h4 class='page-header'>Задать вопрос</h4>

            <div class='form-group'>
              <input class='form-control' id='enterText' placeholder='Какой у вас вопрос?' />
            </div>

            <div class='panel-group' id='accordion' role='tablist' aria-multiselectable='true'>
              <div class='panel panel-default' data-num='1'>
                <div class='panel-heading' role='tab'>
                  <h4 class='panel-title'>
                    <a
                      role='button'
                      data-toggle='collapse'
                      data-parent='#accordion'
                      href='#collapse_1'
                      aria-expanded='false'
                      aria-controls='collapse_1'
                    >
                      Общий вопрос
                    </a>
                    <a href='#' class='btn btn-edit' data-toggle='modal' data-target='#editModal'>
                      <span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>
                    </a>
                    <a href='javascript:void(0);' class='btn pull-right'>
                      <span class='glyphicon glyphicon-minus top' aria-hidden='true'></span>
                    </a>
                  </h4>
                </div>

                <div
                  id='collapse_1'
                  class='panel-collapse collapse'
                  role='tabpanel'
                  aria-labelledby='collapse_1'
                >
                  <div class='panel-body'>
                    <div class='form-group txtGroup'>
                      <span class='title'>Facebook</span>
                      <input
                        class='form-control pull-right'
                        placeholder='Ссылка на профиль оператора'
                      />
                    </div>

                    <div class='form-group txtGroup'>
                      <span class='title'>VKontakte</span>
                      <input
                        class='form-control pull-right'
                        placeholder='Ссылка на профиль оператора'
                      />
                    </div>

                    <div class='form-group txtGroup'>
                      <span class='title'>Telegram</span>
                      <input
                        class='form-control pull-right'
                        placeholder='Ссылка на профиль оператора'
                      />
                    </div>

                    <div class='form-group txtGroup'>
                      <span class='title'>Viber</span>
                      <input
                        class='form-control pull-right'
                        placeholder='Ссылка на профиль оператора'
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class='panel panel-default' data-num='2'>
                <div class='panel-heading' role='tab'>
                  <h4 class='panel-title'>
                    <a
                      role='button'
                      data-toggle='collapse'
                      data-parent='#accordion'
                      href='#collapse_2'
                      aria-expanded='false'
                      aria-controls='collapse_2'
                    >
                      Обучение
                    </a>
                    <a href='#' class='btn btn-edit' data-toggle='modal' data-target='#editModal'>
                      <span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>
                    </a>
                    <a href='javascript:void(0);' class='btn pull-right'>
                      <span class='glyphicon glyphicon-minus top' aria-hidden='true'></span>
                    </a>
                  </h4>
                </div>

                <div
                  id='collapse_2'
                  class='panel-collapse collapse in'
                  role='tabpanel'
                  aria-labelledby='collapse_1'
                >
                  <div class='panel-body'>
                    <div class='form-group txtGroup'>
                      <span class='title'>Facebook</span>
                      <input
                        class='form-control pull-right'
                        placeholder='Ссылка на профиль оператора'
                      />
                    </div>

                    <div class='form-group txtGroup'>
                      <span class='title'>VKontakte</span>
                      <input
                        class='form-control pull-right'
                        placeholder='Ссылка на профиль оператора'
                      />
                    </div>

                    <div class='form-group txtGroup'>
                      <span class='title'>Telegram</span>
                      <input
                        class='form-control pull-right'
                        placeholder='Ссылка на профиль оператора'
                      />
                    </div>

                    <div class='form-group txtGroup'>
                      <span class='title'>Viber</span>
                      <input
                        class='form-control pull-right'
                        placeholder='Ссылка на профиль оператора'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class='panel panel-default' data-num='3'>
                <div class='panel-heading' role='tab'>
                  <h4 class='panel-title'>
                    <a
                      role='button'
                      data-toggle='collapse'
                      data-parent='#accordion'
                      href='#collapse_3'
                      aria-expanded='false'
                      aria-controls='collapse_3'
                    >
                      Инвестиции
                    </a>
                    <a href='#' class='btn btn-edit' data-toggle='modal' data-target='#editModal'>
                      <span class='glyphicon glyphicon-pencil' aria-hidden='true'></span>
                    </a>
                    <a href='javascript:void(0);' class='btn pull-right'>
                      <span class='glyphicon glyphicon-minus top' aria-hidden='true'></span>
                    </a>
                  </h4>
                </div>

                <div
                  id='collapse_3'
                  class='panel-collapse collapse'
                  role='tabpanel'
                  aria-labelledby='collapse_1'
                >
                  <div class='panel-body'>
                    <div class='form-group txtGroup'>
                      <span class='title'>Facebook</span>
                      <input
                        class='form-control pull-right'
                        placeholder='Ссылка на профиль оператора'
                      />
                    </div>

                    <div class='form-group txtGroup'>
                      <span class='title'>VKontakte</span>
                      <input
                        class='form-control pull-right'
                        placeholder='Ссылка на профиль оператора'
                      />
                    </div>

                    <div class='form-group txtGroup'>
                      <span class='title'>Telegram</span>
                      <input
                        class='form-control pull-right'
                        placeholder='Ссылка на профиль оператора'
                      />
                    </div>

                    <div class='form-group txtGroup'>
                      <span class='title'>Viber</span>
                      <input
                        class='form-control pull-right'
                        placeholder='Ссылка на профиль оператора'
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class='form-group'>
                <a class='btn btn-success chBlock' href='javascript:void(0);' role='button'>
                  Добавить раздел
                </a>
              </div>

              <div class='form-group'>
                <a class='btn btn-danger json' href='javascript:void(0);' role='button'>
                  JSON
                </a>
              </div>
            </div>
          </main>
        </div>
      </div>
    ];
  }
}

const mapStateToProps = (state) => ({
  show_mybots: state.show_mybots,
  bot: state.bot
});

export default connect(mapStateToProps)(QuestionModule);
