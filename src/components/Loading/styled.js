import styled, { keyframes } from 'styled-components';
import { colors } from '../../styles/theme';

const rotate = keyframes`
    100% {
        transform: rotate(360deg);
    }
`;

const dash = keyframes`
    0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
    }
    100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
    }
`;

export const Container = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;

    .backdrop {
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(15, 23, 42, 0.4);
        backdrop-filter: blur(4px);
    }

    .content {
        position: relative;
        z-index: 2;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #FFFFFF;
        padding: 24px;
        border-radius: 16px;
        box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1);
        border: 1px solid ${colors.border};
    }
`;

export const Spinner = styled.svg`
    animation: ${rotate} 1.5s linear infinite;
    width: 44px;
    height: 44px;

    & .path {
        stroke: ${colors.primary};
        stroke-linecap: round;
        animation: ${dash} 1.5s ease-in-out infinite;
    }
`;
