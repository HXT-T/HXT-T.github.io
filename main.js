document.addEventListener('DOMContentLoaded', function() {
    // 移动端菜单切换
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
    
    // FAQ问答切换
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const answer = this.nextElementSibling;
                const icon = this.querySelector('.toggle-icon i');
                
                // 切换回答的显示/隐藏
                answer.classList.toggle('active');
                
                // 切换图标
                if (icon) {
                    if (answer.classList.contains('active')) {
                        icon.classList.remove('fa-plus');
                        icon.classList.add('fa-minus');
                    } else {
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                    }
                }
            });
        });
    }
    
    // 搜索框功能
    const searchBox = document.querySelector('.search-box input');
    
    if (searchBox) {
        searchBox.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                // 这里可以添加搜索功能的实现
                alert('搜索功能: ' + this.value);
            }
        });
    }
    
    // 联系表单提交
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // 这里可以添加表单验证和提交逻辑
            alert(`表单提交成功！\n姓名: ${name}\n邮箱: ${email}\n主题: ${subject}\n内容: ${message}`);
            
            // 清空表单
            this.reset();
        });
    }
    
    // 为文章页面的分类和标签添加点击事件
    const filterLinks = document.querySelectorAll('.filter-list a, .tags .tag');
    
    if (filterLinks.length > 0) {
        filterLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 移除所有active类
                filterLinks.forEach(item => item.classList.remove('active'));
                
                // 为当前点击的链接添加active类
                this.classList.add('active');
                
                // 这里可以添加筛选文章的逻辑
                const filterType = this.textContent.trim().split(' ')[0];
                alert(`筛选条件: ${filterType}`);
            });
        });
    }
    
    // 为分页添加点击事件
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    
    if (paginationLinks.length > 0) {
        paginationLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 移除所有active类
                paginationLinks.forEach(item => item.classList.remove('active'));
                
                // 为当前点击的链接添加active类
                if (!this.classList.contains('next')) {
                    this.classList.add('active');
                }
                
                // 这里可以添加页面切换逻辑
                const pageNum = this.textContent.trim();
                alert(`切换到页面: ${pageNum}`);
            });
        });
    }
    
    // 添加CSS样式以支持FAQ的展开/收起效果
    const style = document.createElement('style');
    style.textContent = `
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .faq-answer.active {
            max-height: 500px;
            padding: 15px 0;
        }
        
        .faq-question {
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);
});
