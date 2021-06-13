
/**
 * 通过学生数组来渲染表格数据
 * @param {Array} data 
 */
function renderTable(data) {
    $('.student-list').find('table tbody').html(data.reduce(function (acc, cur) {
        return acc += `<tr>
        <td>${cur.name}</td>
        <td>${cur.sex === 0 ? '男' : '女'}</td>
        <td>${cur.email}</td>
        <td>${cur.sNo}</td>
        <td>${new Date().getFullYear() - cur.birth}</td>
        <td>${cur.phone}</td>
        <td>${cur.address}</td>
        <td>
            <button class="edit btn">编辑</button>
            <button class="delete btn">删除</button>
        </td>
    </tr>`
    }, ''))

    $('.turn_page').turn_page({
        current: currentPage,
        total: totalPage,
        callback: function (curIndex) {
            currentPage = curIndex;
            getTableData();
        }
    })
}

var totalPage = 1;
var currentPage = 1;
var everyPageNumber = 16;
var students = [];

function getTableData() {
    getData('/api/student/findByPage', {
        page: currentPage,
        size: everyPageNumber
    }, function (rt) {
        console.log(rt);
        var data = rt.data.findByPage;
        var count = rt.data.cont;//学生总数
        totalPage = Math.ceil(count / everyPageNumber);
        console.log(totalPage)
        renderTable(data);
    })
}

/**
 * 通过ajax发送网络请求
 * @param {*} url 
 * @param {*} data 
 * @param {*} success 
 */
function getData(url, data, success) {
    $.ajax({
        url: 'http://open.duyiedu.com' + url,
        method: 'get',
        dataType: 'json',
        data: $.extend({
            appkey: 'Sugela_vac_1602512224562'
        }, data),
        success: success
    })
}


// 查询到所有的学生信息然后保存下来
getData('/api/student/findAll', null, function (rt) {

    if (rt.status == 'success') {
        students = rt.data;
    }
});

/**
 * 为页面中的一些动态交互绑定事件
 */
function bindEvent() {
    // 使用事件委托为删除按钮和编辑按钮绑定事件
    $('.student-list').find('tbody').on('click', 'button', function () {
        var index = $(this).parents('tr').index();
        if ($(this).hasClass('edit')) {
            // 编辑按钮
            $('.dialog').slideDown();
            callBackFill(students[index]);
        } else {
            //删除按钮
            var result = confirm(`确认删除学生学号为${students[index].sNo}的学生信息吗?`);
            if (result) {
                getData('/api/student/delBySno', {
                    sNo: students[index].sNo
                }, function (msg) {
                    if (msg.status === 'success') {
                        alert('删除成功!');
                        location.reload();
                    }
                })
            }
        }
    });

    //弹出框的取消事件 
    $('.dialog').click(function (e) {
        if (e.target === this) {
            $(this).slideUp();
        }
    })

    // 编辑框的submit事件
    $('.dialog').find('input:submit').click(function (e) {
        e.preventDefault() || (e.returnValue = false);
        var data = $('#edit-student-form').serializeArray();
        var result = isValidForm(data);
        var dataArr = [];
        for (var index in data) {
            dataArr[data[index].name] = data[index].value;
        }
        // console.log(dataArr);
        if (result.success) {
            getData('/api/student/updateStudent', dataArr, function (rt) {
                if (rt.status === 'success') {
                    alert('修改成功!')
                }
                $('.dialog').slideUp();
            })
        } else {
            alert(result.msg);
        }
        location.reload();
    })

    //列表与新增的切换
    $('.left-content').find('dl').on('click', 'dd', function () {
        $(this).addClass('active').siblings('dd').removeClass('active');
        $('.' + $(this).data('class')).show().siblings().hide();
    })

    // 新增学生页面
    $('#add-student-form').find('input:submit').click(function (e) {
        e.preventDefault() || (e.returnValue = false);
        var data = $('#add-student-form').serializeArray();
        callBackFill(data);
        var dataArr = [];
        for (var index in data) {
            dataArr[data[index].name] = data[index].value;
        }
        console.log(dataArr)
        getData('/api/student/addStudent', dataArr, function (rt) {
            console.log(rt)
            if (rt.status === 'success') {
                $('.add-student').fadeOut().siblings().fadeIn();
                $('#add-student-form').find('input:reset').trigger('click');
                // 这里需要手动刷新，或者将所有信息重新渲染
                location.reload();
            } else {
                alert(rt.msg);
            }
        })
    })

}

/**
 * data的格式为form.serializeArray()
 * @param {Object} data 
 * @returns 
 */
function isValidForm(data) {
    var result = {
        msg: '',
        success: true
    };
    for (var i = 0; i < data.length; ++i) {
        if (!data[i].value && data[i].name !== 'sex') {
            result.success = false;
            result.msg = '请填写' + data[i].name + '信息!'
        }
    }
    // 邮箱的验证
    if (!data[2].value.match(/^\w+@\w+(\.\w+){1,2}$/)) {
        result.msg = '邮箱格式有误,请检查!';
        result.success = false;
    }
    //学号的验证
    if (!data[3].value.match(/^\d{4,16}$/)) {
        result.msg = '学号应为4-16位数字!';
        result.success = false;
    }
    // 出生年龄的验证
    if (data[4].value > new Date().getFullYear() && data[4].value < 1970) {
        result.msg = '出生年份必须大于1970,并且小于当前年份!';
        result.success = false;
    }
    // 手机号的验证
    if (!data[5].value.match(/^1[0 3-9]\d{9}$/)) {
        result.msg = '手机号格式输入不正确!';
        result.success = false;
    }
    return result;
}

function callBackFill(data) {
    var formData = $('#edit-student-form')[0];
    for (var prop in data) {
        if (formData[prop]) {
            formData[prop].value = data[prop];
        }
    }
}

// localStorage的值的判断
var userData = localStorage.getItem('userId');
$.ajax({
    url: 'http://open.duyiedu.com/api/student/stuLogin',
    method: 'post',
    dataType: 'json',
    data: userData,
    success: function (rt) {
        if (rt.status === 'success') {
            getTableData();
            bindEvent();
        } else{
            location.href="login/login.html"
            alert('用户身份已过期，请重新登录!')
        }
    }
})