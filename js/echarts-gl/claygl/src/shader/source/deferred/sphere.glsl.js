export default "@export clay.deferred.sphere_light\n@import clay.deferred.chunk.light_head\n@import clay.util.calculate_attenuation\n@import clay.deferred.chunk.light_equation\nuniform vec3 lightPosition;\nuniform vec3 lightColor;\nuniform float lightRange;\nuniform float lightRadius;\nuniform vec3 eyePosition;\nvarying vec3 v_Position;\nvoid main()\n{\n @import clay.deferred.chunk.gbuffer_read\n vec3 L = lightPosition - position;\n vec3 V = normalize(eyePosition - position);\n float dist = length(L);\n vec3 R = reflect(V, N);\n float tmp = dot(L, R);\n vec3 cToR = tmp * R - L;\n float d = length(cToR);\n L = L + cToR * clamp(lightRadius / d, 0.0, 1.0);\n L = normalize(L);\n vec3 H = normalize(L + V);\n float ndl = clamp(dot(N, L), 0.0, 1.0);\n float ndh = clamp(dot(N, H), 0.0, 1.0);\n float ndv = clamp(dot(N, V), 0.0, 1.0);\n float attenuation = lightAttenuation(dist, lightRange);\n gl_FragColor.rgb = lightColor * ndl * attenuation;\n glossiness = clamp(glossiness - lightRadius / 2.0 / dist, 0.0, 1.0);\n gl_FragColor.rgb = attenuation * lightEquation(\n lightColor, diffuseColor, specularColor, ndl, ndh, ndv, glossiness\n );\n gl_FragColor.a = 1.0;\n}\n@end";
