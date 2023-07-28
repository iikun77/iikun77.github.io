export default "@export clay.wireframe.vertex\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\nuniform mat4 world : WORLD;\nattribute vec3 position : POSITION;\nattribute vec3 barycentric;\n@import clay.chunk.skinning_header\nvarying vec3 v_Barycentric;\nvoid main()\n{\n vec3 skinnedPosition = position;\n#ifdef SKINNING\n @import clay.chunk.skin_matrix\n skinnedPosition = (skinMatrixWS * vec4(position, 1.0)).xyz;\n#endif\n gl_Position = worldViewProjection * vec4(skinnedPosition, 1.0 );\n v_Barycentric = barycentric;\n}\n@end\n@export clay.wireframe.fragment\nuniform vec3 color : [0.0, 0.0, 0.0];\nuniform float alpha : 1.0;\nuniform float lineWidth : 1.0;\nvarying vec3 v_Barycentric;\n@import clay.util.edge_factor\nvoid main()\n{\n gl_FragColor.rgb = color;\n gl_FragColor.a = (1.0-edgeFactor(lineWidth)) * alpha;\n}\n@end";
