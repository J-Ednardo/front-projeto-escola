import { styled, createGlobalStyle } from 'styled-components';
import { colors, metrics } from './theme';
import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

    * {
        margin: 0;
        padding: 0;
        outline: none;
        box-sizing: border-box;
    }

    body {
        font-family: 'DM Sans', sans-serif;
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

    button {
        cursor: pointer;
        background: ${colors.primary};
        border: none;
        color: #fff;
        padding: 12px 24px;
        border-radius: ${metrics.borderRadius};
        font-weight: 600;
        transition: all 300ms;
    }

    button:hover {
        filter: brightness(90%);
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
