import styled from 'styled-components';
import { colors } from '../../styles/theme';

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    margin-top: 30px;

    label {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        font-weight: 500;
        font-size: 14px;
        color: ${colors.textBody};
    }

    input {
        margin-top: 8px;
    }
`;

export const ProfilePicture = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 0 20px;
    position: relative;
    margin-top: 30px;

    img {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid ${colors.border};
    }

    a {
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        position: absolute;
        bottom: 0;
        color: #fff;
        background: ${colors.primary};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: all 0.3s;

        &:hover {
            transform: scale(1.1);
            color: #fff;
        }
    }
`;
