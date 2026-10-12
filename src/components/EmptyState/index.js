import React from 'react';
import PropTypes from 'prop-types';
import { FaInbox } from 'react-icons/fa';
import { EmptyContainer } from './styled';

export default function EmptyState({ title, description, icon: Icon = FaInbox, action }) {
    return (
        <EmptyContainer>
            <div className="icon-wrapper">
                <Icon size={32} />
            </div>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
            {action && <div className="action-wrapper">{action}</div>}
        </EmptyContainer>
    );
}

EmptyState.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    icon: PropTypes.elementType,
    action: PropTypes.node
};
