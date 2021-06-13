(function () {

    $.fn.extend({
        turn_page: function (config) {
            var defaultConfig = {
                current: 1,
                total: 1,
                callback: function () { }
            };
            config = Object.assign({}, defaultConfig, config);
            var turnpage = new TurnPage(config, this);
            turnpage.init();
        }
    })

    TurnPage.prototype.init = function () {
        this.createDom();
    }
    function TurnPage(options, wrap) {
        this.current = options.current;
        this.wrap = wrap;
        this.total = options.total;
        this.callback = options.callback;
    }

    TurnPage.prototype.createDom = function () {
        var ulWrapper = $('<ul class="my_page_wrapper"></ul>')
        
        // 如果当前页不是第一页，创建上一页按钮
        if (this.current > 1) {
            ulWrapper.append('<li class="prev">上一页</li>')
        }

        // 创建第一页的角标
        ulWrapper.append(`<li class=${this.current === 1 ? 'current' : ''}>1</li>`);

        // 证明this.current至少是第5页，那么创建出...
        if (this.current - 3 > 1) {
            $(ulWrapper).append('<li>...</li>');
        }

        for (var i = this.current - 2; i < this.current + 3; ++i) {
            // 插入当前页为中间，一共五个按钮
            if (i > 1 && i < this.total) {
                if (i === this.current) {
                    ulWrapper.append(`<li class="current">${i}</li>`);
                } else {
                    ulWrapper.append(`<li>${i}</li>`);
                }
            }
        }
        // 证明这里至少是倒数第四页7 8 9 10 
        if (this.current + 3 + 1 <= this.total) {
            ulWrapper.append('<li>...</li>')
        }
        if (this.total !== 1) {
            $(ulWrapper).append(`<li class=${this.current === this.total ? 'current' : ''}>${this.total}</li>`);
        }
        if (this.current !== this.total) {
            ulWrapper.append(`<li class="next">下一页</li>`)
        }
        this.wrap.empty().append(ulWrapper);
        // 给新创建的结构绑定事件
        this.bindEvent();
    }

    TurnPage.prototype.bindEvent = function () {
        var self = this;
        $(this.wrap).find('ul.my_page_wrapper').on('click', 'li', function () {
            if ($(this).hasClass('prev')) {
                self.current = self.current - 1 > 1 ? self.current - 1 : 1;
            } else if ($(this).hasClass('next')) {
                self.current = self.current + 1 > self.total ? self.total : self.current + 1;
            } else if(!isNaN(parseInt($(this).text()))){
                self.current = parseInt($(this).text());
            }
            self.createDom();
            self.callback(self.current);
        });
    }
}())