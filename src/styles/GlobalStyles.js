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
        height: 100%;
    }

    #root {
        display: flex;
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
