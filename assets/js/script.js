document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const sidebar = document.getElementById('sidebar');
    const sidebarCollapseBtn = document.getElementById('sidebarCollapse'); 
    const sidebarToggleBtn = document.getElementById('sidebarToggle'); 

    async function loadPage(pageName) {
        try {
            const response = await fetch(`pages/${pageName}`);
            if (!response.ok) {
                if (response.status === 404) {
                    console.error(`Página não encontrada: pages/${pageName}`);
                    mainContent.innerHTML = `<div class="alert alert-danger" role="alert">Página não encontrada: ${pageName}.</div>`;
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            mainContent.innerHTML = html;
            
            // Re-bind event listeners after content is loaded (important for SPA)
            bindLoginRegisterEvents(); 

            // Inicializar gráficos do dashboard se a página for o dashboard
            if (pageName === 'dashboard.html') {
                initializeDashboardCharts();
            }

            // Adicionar event listeners para a página da biblioteca (se for ela)
            if (pageName === 'library.html') {
                document.querySelectorAll('.view-details-btn').forEach(button => {
                    button.addEventListener('click', () => {
                        loadPage('book-details.html'); 
                    });
                });

                document.querySelectorAll('.d-flex.flex-wrap.gap-2 button[data-filter]').forEach(button => {
                    button.addEventListener('click', (e) => {
                        document.querySelectorAll('.d-flex.flex-wrap.gap-2 button').forEach(btn => {
                            btn.classList.remove('active', 'custom-btn-primary');
                            btn.classList.add('btn-outline-primary');
                        });
                        e.currentTarget.classList.add('active', 'custom-btn-primary');
                        e.currentTarget.classList.remove('btn-outline-primary');

                        const filter = e.currentTarget.dataset.filter;
                        alert(`Filtrando livros por: ${filter}`);
                    });
                });
            }

            // Adicionar event listeners para a página de Cadastro de Livro
            if (pageName === 'add-book.html') {
                const bookCoverUpload = document.getElementById('bookCoverUpload');
                const previewImage = document.getElementById('previewImage');
                const addBookForm = document.getElementById('addBookForm');
                const cancelAddBookBtn = document.querySelector('[data-action="cancel-add-book"]');

                if (bookCoverUpload) {
                    bookCoverUpload.addEventListener('change', (event) => {
                        const file = event.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                previewImage.src = e.target.result;
                                previewImage.style.display = 'block';
                            };
                            reader.readAsDataURL(file);
                        } else {
                            previewImage.src = '';
                            previewImage.style.display = 'none';
                        }
                    });
                }

                if (addBookForm) {
                    addBookForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const formData = {
                            title: document.getElementById('bookTitle').value,
                            author: document.getElementById('bookAuthor').value,
                            editor: document.getElementById('bookEditor').value,
                            genre: document.getElementById('bookGenre').value,
                            publicationYear: document.getElementById('publicationYear').value,
                            numPages: document.getElementById('numPages').value,
                            description: document.getElementById('bookDescription').value,
                            isbn: document.getElementById('bookISBN').value,
                            location: document.getElementById('bookLocation').value,
                            quantity: document.getElementById('bookQuantity').value,
                            coverImage: bookCoverUpload.files[0] 
                        };

                        console.log('Dados do Livro:', formData);
                        alert('Livro cadastrado (simulação)!');
                        loadPage('library.html'); 
                    });
                }

                if (cancelAddBookBtn) {
                    cancelAddBookBtn.addEventListener('click', () => {
                        if (confirm('Deseja realmente cancelar o cadastro e voltar para a Biblioteca?')) {
                            loadPage('library.html');
                        }
                    });
                }
            }

            // Adicionar event listeners para a página de Gerenciamento de Empréstimos
            if (pageName === 'loan.html') {
                const newLoanForm = document.getElementById('newLoanForm');
                const cancelLoanBtn = document.querySelector('[data-action="cancel-loan"]');

                if (newLoanForm) {
                    newLoanForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const loanData = {
                            reader: document.getElementById('loanReader').value,
                            returnDate: document.getElementById('returnDate').value,
                            bookISBN: document.getElementById('bookSearchISBN').value,
                            selectedBook: document.getElementById('selectedBook').value,
                            description: document.getElementById('loanDescription').value
                        };
                        console.log('Dados do Novo Empréstimo:', loanData);
                        alert('Empréstimo registrado (simulação)!');
                        loadPage('loan.html'); 
                    });
                }

                if (cancelLoanBtn) {
                    cancelLoanBtn.addEventListener('click', () => {
                        if (confirm('Deseja realmente cancelar o registro de empréstimo?')) {
                            loadPage('dashboard.html'); 
                        }
                    });
                }

                document.querySelectorAll('#returns .btn-success').forEach(button => {
                    button.addEventListener('click', (e) => {
                        alert('Devolver livro (simulação)!');
                    });
                });

                document.querySelectorAll('#active-loans .btn-warning').forEach(button => {
                    button.addEventListener('click', (e) => {
                        alert('Prorrogar empréstimo (simulação)!');
                    });
                });
                document.querySelectorAll('#active-loans .custom-btn-primary').forEach(button => {
                    button.addEventListener('click', (e) => {
                        alert('Devolver livro (simulação)!');
                    });
                });

                const loanTabsElement = document.getElementById('loanTabs');
                if (loanTabsElement) {
                    const firstTab = new bootstrap.Tab(loanTabsElement.querySelector('#new-loan-tab'));
                    firstTab.show(); 
                }
            }

            // Adicionar event listeners para a página de Gerenciamento de Reservas
            if (pageName === 'reservations.html') {
                const reservationTabsElement = document.getElementById('reservationTabs');
                if (reservationTabsElement) {
                    const firstTab = new bootstrap.Tab(reservationTabsElement.querySelector('#active-reservations-tab'));
                    firstTab.show(); 
                }

                document.querySelectorAll('#reservationTabsContent .btn-info').forEach(button => { 
                    button.addEventListener('click', (e) => {
                        alert('Ver detalhes da reserva (simulação)!');
                    });
                });

                document.querySelectorAll('#reservationTabsContent .btn-danger').forEach(button => { 
                    button.addEventListener('click', (e) => {
                        if (confirm('Deseja realmente cancelar esta reserva?')) {
                            alert('Reserva cancelada (simulação)!');
                        }
                    });
                });

                const newReservationBtn = document.querySelector('#reservationTabsContent .custom-btn-primary');
                if (newReservationBtn) {
                    newReservationBtn.addEventListener('click', () => {
                        alert('Formulário de Nova Reserva (simulação)!');
                    });
                }
            }

            // Adicionar event listeners para a página de Gerenciamento de Leitores
            if (pageName === 'readers.html') {
                const addReaderBtn = document.querySelector('.custom-btn-primary');
                if (addReaderBtn) {
                    addReaderBtn.addEventListener('click', () => {
                        alert('Abrir formulário para adicionar novo leitor (simulação)!');
                    });
                }

                document.querySelectorAll('#readers .btn-info').forEach(button => { 
                    button.addEventListener('click', (e) => {
                        alert('Ver detalhes do leitor (simulação)!');
                    });
                });

                document.querySelectorAll('#readers .btn-warning').forEach(button => { 
                    button.addEventListener('click', (e) => {
                        alert('Editar leitor (simulação)!');
                    });
                });

                document.querySelectorAll('#readers .btn-danger').forEach(button => { 
                    button.addEventListener('click', (e) => {
                        if (confirm('Deseja realmente remover este leitor? Esta ação não pode ser desfeita.')) {
                            alert('Leitor removido (simulação)!');
                        }
                    });
                });
            }

            // Adicionar event listeners para a página de Histórico de Empréstimos
            if (pageName === 'history.html') {
                document.querySelector('.d-flex.gap-2 .btn-outline-secondary').addEventListener('click', () => {
                    alert('Filtrar histórico (simulação)!');
                });

                document.querySelectorAll('#history .btn-info').forEach(button => { 
                    button.addEventListener('click', (e) => {
                        alert('Ver detalhes do empréstimo (simulação)!');
                    });
                });

                document.querySelectorAll('#history .btn-success').forEach(button => { 
                    if (!button.classList.contains('disabled')) {
                        button.addEventListener('click', (e) => {
                            alert('Registrar Devolução (simulação)!');
                        });
                    }
                });
            }

            // Adicionar event listeners para a página de Perfil do Usuário
            if (pageName === 'profile.html') {
                const editProfileBtn = document.querySelector('#profile .btn-outline-secondary');
                if (editProfileBtn) {
                    editProfileBtn.addEventListener('click', () => {
                        alert('Abrir formulário de edição de perfil (simulação)!');
                    });
                }

                document.querySelectorAll('#profile .list-group-item .btn-sm').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const actionText = e.currentTarget.textContent.trim();
                        alert(`Ação de Notificação: "${actionText}" (simulação)!`);
                    });
                });

                const viewFullHistoryLink = document.querySelector('#profile a[data-page="history"]');
                if (viewFullHistoryLink) {
                    viewFullHistoryLink.addEventListener('click', (e) => {
                        e.preventDefault(); 
                        loadPage('history.html'); 
                    });
                }
            }

            // Adicionar event listeners para a página de Gerenciamento de Dispositivos IoT
            if (pageName === 'iot-devices.html') {
                const addDeviceBtn = document.querySelector('.custom-btn-primary');
                if (addDeviceBtn) {
                    addDeviceBtn.addEventListener('click', () => {
                        alert('Abrir formulário para adicionar novo dispositivo (simulação)!');
                    });
                }

                document.querySelectorAll('#iot-devices .btn-info').forEach(button => { 
                    button.addEventListener('click', (e) => {
                        alert('Ver detalhes do dispositivo (simulação)!');
                    });
                });

                document.querySelectorAll('#iot-devices .btn-warning').forEach(button => { 
                    button.addEventListener('click', (e) => {
                        alert('Editar dispositivo (simulação)!');
                    });
                });

                document.querySelectorAll('#iot-devices .btn-danger').forEach(button => { 
                    button.addEventListener('click', (e) => {
                        if (confirm('Deseja realmente remover este dispositivo? Esta ação não pode ser desfeita.')) {
                            alert('Dispositivo removido (simulação)!');
                        }
                    });
                });
            }

            // Adicionar event listeners e gráficos para a página de Relatórios
            if (pageName === 'reports.html') {
                // Função para inicializar os gráficos de relatório
                function initializeReportCharts() {
                    // Gráfico: Uso de Livros por Gênero (Gráfico de Pizza/Donut)
                    const genreUsageCtx = document.getElementById('genreUsageChart');
                    if (genreUsageCtx) {
                        new Chart(genreUsageCtx, {
                            type: 'doughnut', 
                            data: {
                                labels: ['Ficção', 'Fantasia', 'Romance', 'Não Ficção', 'Outros'],
                                datasets: [{
                                    label: 'Livros',
                                    data: [300, 200, 150, 100, 50], 
                                    backgroundColor: [
                                        'rgba(140, 34, 75, 0.8)', // custom-primary
                                        'rgba(75, 192, 192, 0.8)',
                                        'rgba(255, 159, 64, 0.8)',
                                        'rgba(54, 162, 235, 0.8)',
                                        'rgba(153, 102, 255, 0.8)'
                                    ],
                                    borderColor: 'white',
                                    borderWidth: 2
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'right', 
                                        labels: {
                                            boxWidth: 20
                                        }
                                    },
                                    title: {
                                        display: true,
                                        text: 'Distribuição de Gêneros'
                                    }
                                }
                            }
                        });
                    }

                    // Gráfico: Empréstimos por Período (Gráfico de Barras - Mensal)
                    const loansOverTimeCtx = document.getElementById('loansOverTimeChart');
                    if (loansOverTimeCtx) {
                        new Chart(loansOverTimeCtx, {
                            type: 'bar', 
                            data: {
                                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                                datasets: [{
                                    label: 'Empréstimos',
                                    data: [180, 210, 190, 230, 250, 220],
                                    backgroundColor: 'rgba(75, 192, 192, 0.8)',
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    borderWidth: 1
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Número de Empréstimos'
                                        }
                                    },
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Mês'
                                        }
                                    }
                                },
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    title: {
                                        display: true,
                                        text: 'Total de Empréstimos por Mês'
                                    }
                                }
                            }
                        });
                    }
                }

                initializeReportCharts();

                document.querySelectorAll('#reports .btn-sm').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const actionText = e.currentTarget.textContent.trim();
                        alert(`Ação de Relatório: "${actionText}" (simulação)!`);
                    });
                });
            }


        } catch (error) {
            console.error('Erro ao carregar a página:', error);
            mainContent.innerHTML = `<div class="alert alert-danger" role="alert">Não foi possível carregar a página: ${pageName}. Verifique o console para mais detalhes.</div>`;
        }
    }

    // Lógica de carregamento inicial
    const isLoggedInOnLoad = false; 
    if (isLoggedInOnLoad) {
        document.body.classList.add('logged-in');
        loadPage('dashboard.html');
    } else {
        document.body.classList.remove('logged-in'); 
        loadPage('login.html'); 
    }

    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            
            if (page === 'logout') {
                alert('Funcionalidade de Logout: Você foi desconectado.');
                document.body.classList.remove('logged-in'); 
                loadPage('login.html'); 
            } else if (['login', 'register', 'forgot-password'].includes(page)) {
                document.body.classList.remove('logged-in');
                loadPage(`${page}.html`);
            } else {
                document.body.classList.add('logged-in'); 
                loadPage(`${page}.html`);
                
                if (window.innerWidth < 992) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });

    function bindLoginRegisterEvents() {
        const showRegisterBtn = document.querySelector('[data-action="show-register"]');
        const showLoginBtn = document.querySelector('[data-action="show-login"]');
        const showForgotPasswordBtn = document.querySelector('[data-action="show-forgot-password"]');
        const connectAccountBtn = document.querySelector('[data-action="connect-account"]');
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Login Tentado! Implementar validação e autenticação real com backend.');
                
                document.body.classList.add('logged-in'); 
                loadPage('dashboard.html'); 
            });
        }

        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Cadastro Tentado! Implementar validação e criação de usuário com backend.');
                loadPage('login.html'); 
            });
        }

        const forgotPasswordForm = document.getElementById('forgotPasswordForm');
        if (forgotPasswordForm) {
            forgotPasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Redefinição de Senha Solicitada! Um e-mail foi enviado (simulação).');
                loadPage('login.html'); 
            });
        }

        if (showRegisterBtn) {
            showRegisterBtn.addEventListener('click', () => loadPage('register.html'));
        }
        if (showLoginBtn || connectAccountBtn) { 
            if (showLoginBtn) showLoginBtn.addEventListener('click', () => loadPage('login.html'));
            if (connectAccountBtn) connectAccountBtn.addEventListener('click', () => loadPage('login.html'));
        }
        if (showForgotPasswordBtn) {
            showForgotPasswordBtn.addEventListener('click', () => loadPage('forgot-password.html'));
        }
    }

    // Função para inicializar os gráficos do Dashboard
    function initializeDashboardCharts() {
        // Gráfico de Tendências de Empréstimo (Linhas)
        const loanTrendsCtx = document.getElementById('loanTrendsChart');
        if (loanTrendsCtx) {
            new Chart(loanTrendsCtx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Empréstimos',
                        data: [120, 150, 130, 160, 180, 200],
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                        tension: 0.3 
                    }, {
                        label: 'Devoluções',
                        data: [110, 135, 125, 145, 160, 175],
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, 
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    plugins: {
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                        },
                        title: {
                            display: true,
                            text: 'Tendências de Empréstimo e Devolução (Últimos 6 meses)'
                        }
                    }
                }
            });
        }

        // Gráfico de Usuários Mais Ativos (Barras Horizontais)
        const activeUsersCtx = document.getElementById('activeUsersChart');
        if (activeUsersCtx) {
            new Chart(activeUsersCtx, {
                type: 'bar',
                data: {
                    labels: ['Gustavo Santos', 'Enzo Erick', 'Gabriel Vieira', 'Nara Flávia', 'Pedro Joaquim'],
                    datasets: [{
                        label: 'Empréstimos Ativos',
                        data: [35, 22, 18, 15, 10], 
                        backgroundColor: [
                            'rgba(140, 34, 75, 0.7)', 
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(255, 159, 64, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(153, 102, 255, 0.7)'
                        ],
                        borderColor: [
                            'rgba(140, 34, 75, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 159, 64, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(153, 102, 255, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'y', // Faz as barras serem horizontais
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Número de Empréstimos Ativos'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Usuários'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false 
                        },
                        title: {
                            display: true,
                            text: 'Usuários Mais Ativos (Empréstimos)'
                        }
                    }
                }
            });
        }

        // Gráfico de Livros Mais Emprestados (Barras Verticais)
        const mostLentBooksCtx = document.getElementById('mostLentBooksChart');
        if (mostLentBooksCtx) {
            new Chart(mostLentBooksCtx, {
                type: 'bar', 
                data: {
                    labels: ['KNY Vol 1', 'A Arte do Guerra', 'Harry Potter', 'O Pequeno Príncipe', '1984'], 
                    datasets: [{
                        label: 'Total de Empréstimos',
                        data: [78, 65, 48, 42, 39], 
                        backgroundColor: 'rgba(75, 192, 192, 0.7)', 
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Número de Empréstimos'
                            }
                        },
                        x: { 
                            title: {
                                display: true,
                                text: 'Livros'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false 
                        },
                        title: {
                            display: true,
                            text: 'Livros Mais Emprestados'
                        }
                    }
                }
            });
        }
    }


    if (sidebarCollapseBtn) {
        sidebarCollapseBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    mainContent.addEventListener('click', () => {
        if (window.innerWidth < 992 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    });
});