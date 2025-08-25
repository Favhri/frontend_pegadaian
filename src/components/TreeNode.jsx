// src/components/TreeNode.jsx
import React from 'react';
import PropTypes from 'prop-types';

const TreeNode = ({ node }) => {
  return (
    <li>
      {/* Card untuk setiap orang */}
      <div className="node-card w-64 mx-auto bg-white border-2 border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <div className="p-4 text-center">
          <img
            src={node.avatar}
            alt={node.nama}
            className="w-20 h-20 rounded-full mx-auto mb-3 border-4 border-green-200"
          />
          <h3 className="text-lg font-semibold text-gray-800">{node.nama}</h3>
          <p className="text-sm font-medium text-green-600">{node.jabatan}</p>
        </div>
      </div>
      
      {/* Render anak-anaknya jika ada */}
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
    avatar: PropTypes.string,
    children: PropTypes.array,
  }).isRequired,
};

export default TreeNode;