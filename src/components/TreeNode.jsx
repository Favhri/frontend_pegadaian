// src/components/TreeNode.jsx
import React from 'react';
import PropTypes from 'prop-types';

const TreeNode = ({ node }) => {
  const liClassName = node.layout === 'special-case' ? 'special-layout-node' : '';

  return (
    <li className={liClassName}>
      <div className="node-card">
        <div className="text-center">
          <h3 className="font-semibold text-gray-800 mb-1">{node.nama}</h3>
          <p className="text-green-600 font-medium leading-tight">{node.jabatan}</p>
        </div>
      </div>
      
      {node.children && node.children.length > 0 && (
        <ul>
          {node.children.map((childNode) => (
            <TreeNode key={childNode.id} node={childNode} />
          ))}
        </ul>
      )}
    </li>
  );
};

TreeNode.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nama: PropTypes.string.isRequired,
    jabatan: PropTypes.string.isRequired,
    avatar: PropTypes.string, // Optional, tidak dipakai lagi
    children: PropTypes.array,
    layout: PropTypes.string,
  }).isRequired,
};

export default TreeNode;