import { styled, createGlobalStyle } from 'styled-components';
import { colors, metrics } from './theme';
import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    * {
        margin: 0;
        padding: 0;
        outline: none;
        box-sizing: border-box;
    }

    body {
        font-family: 'Plus Jakarta Sans', sans-serif;
        background: ${colors.background};
        color: ${colors.textTitle};
        -webkit-font-smoothing: antialiased;
    }

    html, body, #root {
        min-height: 100vh;
    }

    #root {
        display: flex;
        align-items: stretch;
    }

    input, select {
        height: 48px;
        font-size: 15px;
        font-family: inherit;
        border: 1px solid ${colors.border};
        padding: 0 16px;
        border-radius: 12px;
        background: #FAFAFA;
        transition: all 0.3s;
        color: ${colors.textTitle};

        &:focus {
            border: 1px solid ${colors.primary};
            box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
            background: #fff;
        }
        
        &:disabled {
            background: #E8E9ED;
            cursor: not-allowed;
        }
    }

    button {
        cursor: pointer;
        background: ${colors.primary};
        border: none;
        color: #fff;
        padding: 0 24px;
        height: 48px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        font-weight: 600;
        font-size: 15px;
        font-family: inherit;
        transition: all 300ms;
    }

    button:hover {
        filter: brightness(90%);
        transform: translateY(-1px);
    }

    a {
        text-decoration: none;
        color: ${colors.primary};
        transition: all 300ms;
    }

    table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        background: #fff;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        border: 1px solid #F1F2F6;
        margin: 20px 0;
    }

    th {
        text-align: left;
        padding: 16px 24px;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 700;
        color: #8F95B2;
        background: #FAFBFC;
        border-bottom: 1px solid #F1F2F6;
    }

    td {
        padding: 16px 24px;
        font-size: 14px;
        color: #2D3436;
        border-bottom: 1px solid #F1F2F6;
        vertical-align: middle;
    }

    tr:last-child td {
        border-bottom: none;
    }

    tbody tr {
        transition: all 0.2s ease;
    }

    tbody tr:hover {
        background: #F8F9FA;
    }

    ul {
        list-style: none;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }
`;

export const Container = styled.section`
    width: 100%;
    max-width: 1000px;
    background: ${colors.cardBg};
    margin: 40px auto;
    padding: 40px;
    border-radius: ${metrics.borderRadius};
    box-shadow: ${metrics.boxShadow};
    border: 1px solid ${colors.border};
`;
