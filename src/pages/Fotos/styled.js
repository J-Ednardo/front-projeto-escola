import styled from 'styled-components';
import { colors } from '../../styles/theme';

export const Title = styled.h1`
    text-align: center;
`;

export const Form = styled.form`
    label {
        height: 180px;
        width: 180px;
        display: flex;
        background: ${colors.background};
        border: 3px dashed ${colors.primary};
        margin: 30px auto;
        cursor: pointer;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: all 0.3s;

        &:hover {
            border-color: ${colors.primaryDark};
            background: #EDEAFC;
        }
    }

    img {
        height: 180px;
        width: 180px;
        object-fit: cover;
    }
    
    input {
        display: none;
    }
`;
