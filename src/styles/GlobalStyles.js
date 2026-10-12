import { styled, createGlobalStyle } from 'styled-components';
import { colors, metrics } from './theme';
import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    * {
        margin: 0;
        padding: 0;
        outline: none;
        box-sizing: border-box;
    }

    body {
        font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: ${colors.background};
        color: ${colors.textBody};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }

    html, body, #root {
        min-height: 100vh;
    }

    #root {
        display: flex;
        align-items: stretch;
    }

    h1, h2, h3, h4, h5, h6 {
        color: ${colors.textTitle};
        font-weight: 700;
        letter-spacing: -0.02em;
    }

    h1 {
        font-size: 1.65rem;
        line-height: 1.25;
        margin-bottom: 8px;
    }

    h2 {
        font-size: 1.25rem;
        line-height: 1.3;
    }

    h3 {
        font-size: 1.1rem;
        line-height: 1.4;
    }

    input, select {
        height: 44px;
        font-size: 14px;
        font-family: inherit;
        border: 1px solid ${colors.border};
        padding: 0 14px;
        border-radius: ${metrics.borderRadiusSm};
        background: #FFFFFF;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
        color: ${colors.textTitle};

        &::placeholder {
            color: ${colors.textMuted};
        }

        &:focus {
            border-color: ${colors.primary};
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
            background: #FFFFFF;
        }
        
        &:disabled {
            background: #F1F5F9;
            color: ${colors.textMuted};
            cursor: not-allowed;
            border-color: ${colors.border};
        }
    }

    button {
        cursor: pointer;
        background: ${colors.primary};
        border: 1px solid transparent;
        color: #FFFFFF;
        padding: 0 20px;
        height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        border-radius: ${metrics.borderRadiusSm};
        font-weight: 600;
        font-size: 14px;
        font-family: inherit;
        letter-spacing: -0.01em;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: ${metrics.boxShadowSm};

        &:hover {
            background: ${colors.primaryDark};
            transform: translateY(-1px);
            box-shadow: ${metrics.boxShadow};
        }

        &:active {
            transform: scale(0.98);
        }

        &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none !important;
            box-shadow: none !important;
        }
    }

    a {
        text-decoration: none;
        color: ${colors.primary};
        transition: color 0.2s ease;

        &:hover {
            color: ${colors.primaryDark};
        }
    }

    table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        background: #FFFFFF;
        border-radius: ${metrics.borderRadius};
        overflow: hidden;
        box-shadow: ${metrics.boxShadowSm};
        border: 1px solid ${colors.border};
        margin: 20px 0;
        font-variant-numeric: tabular-nums;
    }

    th {
        text-align: left;
        padding: 14px 20px;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 700;
        color: ${colors.textMuted};
        background: #F8FAFC;
        border-bottom: 1px solid ${colors.border};
    }

    td {
        padding: 14px 20px;
        font-size: 14px;
        color: ${colors.textBody};
        border-bottom: 1px solid ${colors.borderLight};
        vertical-align: middle;
    }

    tr:last-child td {
        border-bottom: none;
    }

    tbody tr {
        transition: background-color 0.15s ease;

        &:hover {
            background-color: #F8FAFC;
        }
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
    flex: 1;
    min-width: 0;
    background: ${colors.cardBg};
    margin: 32px;
    padding: 36px 40px;
    border-radius: ${metrics.borderRadiusLg};
    box-shadow: ${metrics.boxShadow};
    border: 1px solid ${colors.border};

    @media (max-width: 768px) {
        margin: 16px;
        padding: 20px;
    }
`;
