export default "@export clay.deferred.gbuffer.vertex\nuniform mat4 worldViewProjection : WORLDVIEWPROJECTION;\nattribute vec3 position : POSITION;\n#if defined(SECOND_PASS) || defined(FIRST_PASS)\nattribute vec2 texcoord : TEXCOORD_0;\nuniform vec2 uvRepeat;\nuniform vec2 uvOffset;\nvarying vec2 v_Texcoord;\n#endif\n#ifdef FIRST_PASS\nuniform mat4 worldInverseTranspose : WORLDINVERSETRANSPOSE;\nuniform mat4 world : WORLD;\nvarying vec3 v_Normal;\nattribute vec3 normal : NORMAL;\nattribute vec4 tangent : TANGENT;\nvarying vec3 v_Tangent;\nvarying vec3 v_Bitangent;\nvarying vec3 v_WorldPosition;\n#endif\n@import clay.chunk.skinning_header\n#ifdef THIRD_PASS\nuniform mat4 prevWorldViewProjection;\nvarying vec4 v_ViewPosition;\nvarying vec4 v_PrevViewPosition;\n#ifdef SKINNING\n#ifdef USE_SKIN_MATRICES_TEXTURE\nuniform sampler2D prevSkinMatricesTexture;\nmat4 getPrevSkinMatrix(float idx) {\n return getSkinMatrix(prevSkinMatricesTexture, idx);\n}\n#else\nuniform mat4 prevSkinMatrix[JOINT_COUNT];\nmat4 getPrevSkinMatrix(float idx) {\n return prevSkinMatrix[int(idx)];\n}\n#endif\n#endif\n#endif\nvoid main()\n{\n vec3 skinnedPosition = position;\n vec3 prevSkinnedPosition = position;\n#ifdef FIRST_PASS\n vec3 skinnedNormal = normal;\n vec3 skinnedTangent = tangent.xyz;\n bool hasTangent = dot(tangent, tangent) > 0.0;\n#endif\n#ifdef SKINNING\n @import clay.chunk.skin_matrix\n skinnedPosition = (skinMatrixWS * vec4(position, 1.0)).xyz;\n #ifdef FIRST_PASS\n skinnedNormal = (skinMatrixWS * vec4(normal, 0.0)).xyz;\n if (hasTangent) {\n skinnedTangent = (skinMatrixWS * vec4(tangent.xyz, 0.0)).xyz;\n }\n #endif\n #ifdef THIRD_PASS\n {\n mat4 prevSkinMatrixWS = getPrevSkinMatrix(joint.x) * weight.x;\n if (weight.y > 1e-4) { prevSkinMatrixWS += getPrevSkinMatrix(joint.y) * weight.y; }\n if (weight.z > 1e-4) { prevSkinMatrixWS += getPrevSkinMatrix(joint.z) * weight.z; }\n float weightW = 1.0-weight.x-weight.y-weight.z;\n if (weightW > 1e-4) { prevSkinMatrixWS += getPrevSkinMatrix(joint.w) * weightW; }\n prevSkinnedPosition = (prevSkinMatrixWS * vec4(position, 1.0)).xyz;\n }\n #endif\n#endif\n#if defined(SECOND_PASS) || defined(FIRST_PASS)\n v_Texcoord = texcoord * uvRepeat + uvOffset;\n#endif\n#ifdef FIRST_PASS\n v_Normal = normalize((worldInverseTranspose * vec4(skinnedNormal, 0.0)).xyz);\n if (hasTangent) {\n v_Tangent = normalize((worldInverseTranspose * vec4(skinnedTangent, 0.0)).xyz);\n v_Bitangent = normalize(cross(v_Normal, v_Tangent) * tangent.w);\n }\n v_WorldPosition = (world * vec4(skinnedPosition, 1.0)).xyz;\n#endif\n#ifdef THIRD_PASS\n v_ViewPosition = worldViewProjection * vec4(skinnedPosition, 1.0);\n v_PrevViewPosition = prevWorldViewProjection * vec4(prevSkinnedPosition, 1.0);\n#endif\n gl_Position = worldViewProjection * vec4(skinnedPosition, 1.0);\n}\n@end\n@export clay.deferred.gbuffer1.fragment\nuniform mat4 viewInverse : VIEWINVERSE;\nuniform float glossiness;\nvarying vec2 v_Texcoord;\nvarying vec3 v_Normal;\nvarying vec3 v_WorldPosition;\nuniform sampler2D normalMap;\nuniform sampler2D diffuseMap;\nvarying vec3 v_Tangent;\nvarying vec3 v_Bitangent;\nuniform sampler2D roughGlossMap;\nuniform bool useRoughGlossMap;\nuniform bool useRoughness;\nuniform bool doubleSided;\nuniform float alphaCutoff: 0.0;\nuniform float alpha: 1.0;\nuniform int roughGlossChannel: 0;\nfloat indexingTexel(in vec4 texel, in int idx) {\n if (idx == 3) return texel.a;\n else if (idx == 1) return texel.g;\n else if (idx == 2) return texel.b;\n else return texel.r;\n}\nvoid main()\n{\n vec3 N = v_Normal;\n if (doubleSided) {\n vec3 eyePos = viewInverse[3].xyz;\n vec3 V = eyePos - v_WorldPosition;\n if (dot(N, V) < 0.0) {\n N = -N;\n }\n }\n if (alphaCutoff > 0.0) {\n float a = texture2D(diffuseMap, v_Texcoord).a * alpha;\n if (a < alphaCutoff) {\n discard;\n }\n }\n if (dot(v_Tangent, v_Tangent) > 0.0) {\n vec3 normalTexel = texture2D(normalMap, v_Texcoord).xyz;\n if (dot(normalTexel, normalTexel) > 0.0) { N = normalTexel * 2.0 - 1.0;\n mat3 tbn = mat3(v_Tangent, v_Bitangent, v_Normal);\n N = normalize(tbn * N);\n }\n }\n gl_FragColor.rgb = (N + 1.0) * 0.5;\n float g = glossiness;\n if (useRoughGlossMap) {\n float g2 = indexingTexel(texture2D(roughGlossMap, v_Texcoord), roughGlossChannel);\n if (useRoughness) {\n g2 = 1.0 - g2;\n }\n g = clamp(g2 + (g - 0.5) * 2.0, 0.0, 1.0);\n }\n gl_FragColor.a = g + 0.005;\n}\n@end\n@export clay.deferred.gbuffer2.fragment\nuniform sampler2D diffuseMap;\nuniform sampler2D metalnessMap;\nuniform vec3 color;\nuniform float metalness;\nuniform bool useMetalnessMap;\nuniform bool linear;\nuniform float alphaCutoff: 0.0;\nuniform float alpha: 1.0;\nvarying vec2 v_Texcoord;\n@import clay.util.srgb\nvoid main()\n{\n float m = metalness;\n if (useMetalnessMap) {\n vec4 metalnessTexel = texture2D(metalnessMap, v_Texcoord);\n m = clamp(metalnessTexel.r + (m * 2.0 - 1.0), 0.0, 1.0);\n }\n vec4 texel = texture2D(diffuseMap, v_Texcoord);\n if (linear) {\n texel = sRGBToLinear(texel);\n }\n if (alphaCutoff > 0.0) {\n float a = texel.a * alpha;\n if (a < alphaCutoff) {\n discard;\n }\n }\n gl_FragColor.rgb = texel.rgb * color;\n gl_FragColor.a = m + 0.005;\n}\n@end\n@export clay.deferred.gbuffer3.fragment\nuniform bool firstRender;\nvarying vec4 v_ViewPosition;\nvarying vec4 v_PrevViewPosition;\nvoid main()\n{\n vec2 a = v_ViewPosition.xy / v_ViewPosition.w;\n vec2 b = v_PrevViewPosition.xy / v_PrevViewPosition.w;\n if (firstRender) {\n gl_FragColor = vec4(0.0);\n }\n else {\n gl_FragColor = vec4((a - b) * 0.5 + 0.5, 0.0, 1.0);\n }\n}\n@end\n@export clay.deferred.gbuffer.debug\n@import clay.deferred.chunk.light_head\nuniform sampler2D gBufferTexture4;\nuniform int debug: 0;\nvoid main ()\n{\n @import clay.deferred.chunk.gbuffer_read\n if (debug == 0) {\n gl_FragColor = vec4(N, 1.0);\n }\n else if (debug == 1) {\n gl_FragColor = vec4(vec3(z), 1.0);\n }\n else if (debug == 2) {\n gl_FragColor = vec4(position, 1.0);\n }\n else if (debug == 3) {\n gl_FragColor = vec4(vec3(glossiness), 1.0);\n }\n else if (debug == 4) {\n gl_FragColor = vec4(vec3(metalness), 1.0);\n }\n else if (debug == 5) {\n gl_FragColor = vec4(albedo, 1.0);\n }\n else {\n vec4 color = texture2D(gBufferTexture4, uv);\n color.rg -= 0.5;\n color.rg *= 2.0;\n gl_FragColor = color;\n }\n}\n@end";