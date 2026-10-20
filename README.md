<div align="center">

# 🖥️ Portal Acadêmico — Front-end de Gestão Escolar

[![CI Frontend](https://img.shields.io/github/actions/workflow/status/J-Ednardo/front-projeto-escola/main.yml?branch=main&label=CI%20Frontend&logo=github)](https://github.com/J-Ednardo/front-projeto-escola/actions)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Redux](https://img.shields.io/badge/Redux%20%2B%20Saga-State-764ABC?logo=redux&logoColor=white)](https://redux.js.org/)
[![Styled Components](https://img.shields.io/badge/Styled--Components-6.x-DB7093?logo=styled-components&logoColor=white)](https://styled-components.com/)
[![Tests](https://img.shields.io/badge/Tests-24%20Passing-C21325?logo=testing-library&logoColor=white)](#testes-automatizados-por-persona-e-cicd)

Aplicação web em **React + Redux + Styled Components** que consome a [API REST de Gestão Acadêmica](https://github.com/J-Ednardo/API-REST), oferecendo interfaces e fluxos dedicados para **Secretaria (`ADMIN`)**, **Docentes (`PROFESSOR`)** e **Estudantes (`ALUNO`)**.

[Repositório da API (Back-end)](https://github.com/J-Ednardo/API-REST) · [Reportar Bug](https://github.com/J-Ednardo/front-projeto-escola/issues) · [Sistema]([https://github.com/J-Ednardo/front-projeto-escola/issues](https://front-projeto-escola.vercel.app)

</div>

---

## 📌 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Experiência por Perfil (RBAC na Interface)](#experiencia-por-perfil-rbac-na-interface)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Funcionalidades e Telas](#funcionalidades-e-telas)
- [Como Executar Localmente](#como-executar-localmente)
- [Testes Automatizados por Persona e CI/CD](#testes-automatizados-por-persona-e-cicd)
- [Estrutura do Projeto](#estrutura-do-projeto)

---

## 📖 Sobre o Projeto

O **Portal Acadêmico** é a interface web do **Ecossistema Escola**. Ele foi projetado com navegação lateral fixa, feedback visual em tempo real, estados de carregamento/vazio e separação clara entre operações administrativas da secretaria, rotinas pedagógicas do professor e acompanhamento estudantil.

---

## 👥 Experiência por Perfil (RBAC na Interface)

A aplicação adapta dinamicamente a navegação, os cabeçalhos, os redirecionamentos pós-login e as ações disponíveis de acordo com o perfil autenticado:

| Perfil | Identificação Visual | Redirecionamento Inicial | O que pode fazer na interface |
|---|---|---|---|
| **`ADMIN`** | Badge Índigo **`ADMIN`** | `/` (Gestão de Alunos) | • Cadastrar, editar e excluir alunos e fotos<br>• Gerenciar **Períodos Letivos** (`ABERTO` / `FECHADO`)<br>• Criar, editar e excluir **Disciplinas** e **Turmas**<br>• Matricular e remover alunos no Diário de Classe<br>• Gerenciar perfis de usuários (`/usuarios`) |
| **`PROFESSOR`** | Badge Verde **`DOCENTE`** | `/turmas` (Minhas Turmas) | • Visualizar exclusivamente **Minhas Turmas** abertas<br>• Lançar notas (`N1`, `N2`, `N3` e `Recuperação` de `0` a `10`) no Diário<br>• Registrar chamadas diárias e conteúdo ministrado<br>• Consultar e retificar presenças em modal dedicado (**Ver Frequência**)<br>• Consultar catálogo de alunos, boletins e históricos em modo leitura |
| **`ALUNO`** | Badge Neutro **`ALUNO`** | `/boletim/:aluno_id` | • Acessar diretamente **Meu Boletim** pelo menu lateral<br>• Exportar boletim completo em **PDF** (`jsPDF`)<br>• Consultar **Meu Histórico Escolar Oficial** com Coeficiente de Rendimento (CR) e Carga Horária Integralizada |

---

## 🚀 Tecnologias Utilizadas

| Categoria | Tecnologia |
|---|---|
| **Biblioteca UI** | React 19 (`react-scripts` 5) |
| **Roteamento** | React Router DOM 5 (com guarda de rotas `MyRoute` por perfil) |
| **Estado Global & Side Effects** | Redux, Redux-Saga, Redux-Persist |
| **Estilização** | Styled Components 6, React Icons (`fa`) |
| **Cliente HTTP** | Axios (com interceptors de token JWT e tratamento padronizado de erros da API) |
| **Exportação de Documentos** | `jspdf` & `jspdf-autotable` |
| **Notificações** | React Toastify |
| **Testes Automatizados** | Jest, React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`), `redux-mock-store` |

---

## 🖥️ Funcionalidades e Telas

- **Barra Lateral Fixa (`Header`)**: Sempre visível durante a rolagem da página, exibindo os atalhos permitidos para o perfil logado, badge de identificação e controle de sessão.
- **Gestão / Consulta de Alunos (`/`)**: Listagem paginada com avatares, acesso rápido ao Boletim e ao Histórico Escolar, e controles administrativos restritos ao `ADMIN`.
- **Períodos Letivos (`/periodos`)**: Criação de semestres e alternância de status entre `ABERTO` e `FECHADO` (que congela alterações nas turmas vinculadas).
- **Disciplinas (`/disciplinas`)**: Catálogo completo com criação, edição inline e exclusão.
- **Turmas (`/turmas`)**: Oculta automaticamente turmas e períodos de semestres encerrados (`FECHADO`). Permite ao `ADMIN` criar, editar e excluir turmas vinculando disciplina, período e professor titular.
- **Diário de Classe (`/turmas/:id/matriculas`)**:
  - Enturmação de alunos (filtrando alunos já matriculados na turma) e remoção de vínculo (`ADMIN`).
  - Lançamento rápido de notas com salvamento automático ao sair do campo (`onBlur`), validação de intervalo `0–10` e cálculo instantâneo de média e situação.
- **Chamada Diária (`/turmas/:id/chamada`)**:
  - Registro de data e conteúdo programático com bloqueio preventivo de chamada duplicada na mesma data.
  - Histórico de **Aulas Ministradas** com modal dedicado (**Ver Frequência**) para consulta e retificação individual de presença/falta.
- **Boletim (`/boletim/:id`) e Histórico Escolar (`/historico/:id`)**: Visão consolidada do desempenho do estudante com geração de documento em PDF.

---

## ⚙️ Como Executar Localmente

### Pré-requisitos
- **Node.js** 18+
- **API REST (Back-end)** rodando localmente (por padrão em `http://localhost:3001`)

### Passo a Passo

1. **Clone o repositório e instale as dependências:**
   ```bash
   git clone https://github.com/J-Ednardo/front-projeto-escola.git
   cd front-projeto-escola
   npm install
   ```

2. **Configure as variáveis de ambiente (opcional):**
   Por padrão, o cliente Axios aponta para `http://localhost:3001`. Para customizar, crie um arquivo `.env` na raiz:
   ```env
   REACT_APP_API_URL=http://localhost:3001
   ```

3. **Inicie a aplicação em modo de desenvolvimento:**
   ```bash
   npm start
   ```
   Acesse em `http://localhost:3000`.

4. **Gere a build de produção:**
   ```bash
   npm run build
   ```

---

## 🧪 Testes Automatizados por Persona e CI/CD

O projeto possui **24 testes automatizados** distribuídos em **10 suítes** utilizando **Jest** e **React Testing Library**, executados automaticamente a cada Push/Pull Request pelo **GitHub Actions** (`.github/workflows/main.yml`).

```bash
# Executar todos os testes em modo não-interativo (CI)
npm test -- --watchAll=false
```

### Suítes de Teste
1. **`src/components/Header/Header.test.js` (3 testes)**: Valida badges e links específicos para os perfis `ADMIN`, `PROFESSOR` e `ALUNO`.
2. **`src/pages/Alunos/Alunos.test.js` (2 testes)**: Paginação da listagem e ocultação de botões de criação/edição/exclusão para `PROFESSOR`.
3. **`src/pages/Turmas/Turmas.test.js` (3 testes)**: Visão `ADMIN` (criação, edição, exclusão e filtro de semestres fechados) vs Visão `PROFESSOR` (`Minhas Turmas`).
4. **`src/pages/Disciplinas/Disciplinas.test.js` (4 testes)**: Listagem, cadastro (`POST`), edição (`PUT`) e exclusão (`DELETE`) de disciplinas.
5. **`src/pages/Periodos/Periodos.test.js` (1 teste)**: Carregamento e exibição de semestres letivos.
6. **`src/pages/Usuarios/Usuarios.test.js` (1 teste)**: Listagem administrativa de usuários e perfis.
7. **`src/pages/DiarioTurma/DiarioTurma.test.js` (3 testes)**: Lançamento de notas pelo `PROFESSOR`, bloqueio de notas fora de `0–10` e enturmação/remoção pelo `ADMIN`.
8. **`src/pages/Chamada/Chamada.test.js` (3 testes)**: Listagem de chamada, bloqueio de data duplicada e abertura do modal **Ver Frequência** com retificação de presença (`PUT /frequencias/:id`).
9. **`src/pages/Boletim/Boletim.test.js` (2 testes)**: Renderização de notas/faltas/situação do estudante e estado vazio.
10. **`src/pages/Historico/Historico.test.js` (2 testes)**: Exibição do Coeficiente de Rendimento (CR), Carga Horária Integralizada e disciplinas por semestre.

---

## 📂 Estrutura do Projeto

```text
front-projeto-escola/
├── public/                  # Arquivos estáticos e template HTML
├── src/
│   ├── components/          # Componentes reutilizáveis (Header, Loading, EmptyState)
│   ├── config/              # Configurações de cores e constantes
│   ├── pages/               # Telas da aplicação e suas respectivas suítes .test.js
│   │   ├── Aluno/           # Formulário de criação/edição de aluno
│   │   ├── Alunos/          # Listagem paginada de alunos
│   │   ├── Boletim/         # Boletim escolar e exportação PDF
│   │   ├── Chamada/         # Registro de aula, chamada em lote e modal de frequência
│   │   ├── DiarioTurma/     # Enturmação e lançamento de notas
│   │   ├── Disciplinas/     # CRUD de disciplinas
│   │   ├── Fotos/           # Upload de fotos de alunos
│   │   ├── Historico/       # Histórico escolar oficial e CR
│   │   ├── Login/           # Autenticação de usuários
│   │   ├── Periodos/        # Gestão de semestres letivos
│   │   ├── Register/        # Cadastro público e edição da própria conta
│   │   ├── Turmas/          # Gestão de turmas (Admin) e Minhas Turmas (Professor)
│   │   └── Usuarios/        # Gestão administrativa de perfis e vínculos
│   ├── routes/              # Definição de rotas e guarda de permissão (MyRoute)
│   ├── services/            # Instância do Axios e histórico de navegação
│   ├── store/               # Redux Store, Reducers, Actions e Redux-Saga (auth)
│   └── styles/              # Tema (Design Tokens) e GlobalStyles
└── .github/workflows/       # Pipeline CI Frontend (Testes + Build)
```
