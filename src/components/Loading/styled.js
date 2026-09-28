import styled from 'styled-components';
import { colors } from '../../styles/theme';

export const Container = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 18px;
    font-weight: 600;

    div {
        position: absolute;
        width: 100%;
        height: 100%;
        z-index: 1;
        background: rgba(24, 26, 37, 0.85);
        backdrop-filter: blur(4px);
    }

    span {
        z-index: 2;
        color: ${colors.primary};
        font-size: 20px;
    }
`;
