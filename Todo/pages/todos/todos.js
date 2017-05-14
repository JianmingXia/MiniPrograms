const URL = 'http://common.api.ryoma.top/api/todo/';

let url_config = {
  list: "listAll",
  update: "update",
  delete: "delete",
  add: "add"
}

let pageParams = {
  data: { 
    todos: [],
    desc: "",
    buttons: {
      defaultSize: 'default',
      primarySize: 'mini',
      warnSize: 'default',
      disabled: false,
      plain: false,
      loading: false
    }
  }
}

pageParams.onLoad = function () {
  const that = this
  wx.request({
    url: URL + url_config.list,
    data: JSON.stringify({}),
    header: { 'content-type': 'application/json' },
    method: 'GET',
    success: res => {
      console.log(res.data)
      that.setData({
        todos: res.data.list
      })
    },
    fail: () => console.error('something is wrong'),
    complete: () => console.log('todos loaded')
  })
}

pageParams.toggleTodo = function (event) {
  const that = this
  const select_todo = event.target.dataset.todo
  const update_todo = Object.assign({}, select_todo, { is_complete: select_todo.is_complete ? 0 : 1 })

  wx.request({
    url: URL + url_config.update,
    data: JSON.stringify(update_todo),
    header: { 'content-type': 'application/json' },
    method: 'PUT',
    success: res => {
      console.log(res.data)
      that.setData({
        todos: that.data.todos.map(todo => {
          if (todo.id === update_todo.id) {
            return update_todo
          }
          return todo
        })
      })
    },
    fail: () => console.error('something is wrong'),
    complete: () => console.log('toggle req completed')
  })
}

pageParams.removeTodo = function (event) {
  const that = this
  const select_todo = event.target.dataset.todo

  wx.request({
    url: URL + url_config.delete,
    data: JSON.stringify(select_todo),
    header: { 'content-type': 'application/json' },
    method: 'DELETE',
    success: res => {
      console.log(res.data)
      that.setData({
        todos: that.data.todos.filter(todo => todo.id !== select_todo.id)
      })
    },
    fail: () => console.error('something is wrong'),
    complete: () => console.log('delete req completed')
  })
}

pageParams.inputTodoDesc = function(event) {
  this.setData({
    desc: event.detail.value
  })
}

pageParams.addTodo = function (event) {
  const that = this
  let desc = that.data.desc;
  if(!(desc.length > 0)) {
    console.error('desc is empty');
    return;
  }

  wx.request({
    url: URL + url_config.add,
    data: JSON.stringify({desc: desc }),
    header: { 'content-type': 'application/json' },
    method: 'POST',
    success: res => {
      let add_todo = res.data.data;
      
      if (add_todo && add_todo.id > 0) {
        that.setData({
          todos: that.data.todos.concat(add_todo)
        })
      }
    },
    fail: () => console.error('something is wrong'),
    complete: () => console.log('delete req completed')
  })
}

Page(pageParams)