package net.coderextreme.x3d.serializer;

import java.util.Objects;

/**
 * An entry in the Parent-Child-ContainerField resolution table.
 * Maps (ParentNode, ChildNode, containerField) -> (methodName, methodType, ruleCategory).
 */
public class ParentChildEntry {
    private final String parentNode;
    private final String childNode;
    private final String containerField;
    private final boolean defaultContainerField;
    private final String methodName;
    private final MethodType methodType;
    private final RuleSource ruleSource;
    private final String notes;

    public enum MethodType {
        ADD,
        SET,
        OTHER
    }

    public enum RuleSource {
        SPECIAL_OVERRIDE,  // mapToMethod2 priority overrides
        CONTAINER_FIELD,   // containerField attribute rules
        MAP_TO_METHOD,     // standard mapToMethod lookup
        DEFAULT_FALLBACK   // standard X3D set/add child convention
    }

    public ParentChildEntry(String parentNode, String childNode, String containerField,
                            boolean defaultContainerField, String methodName,
                            MethodType methodType, RuleSource ruleSource, String notes) {
        this.parentNode = parentNode;
        this.childNode = childNode;
        this.containerField = containerField;
        this.defaultContainerField = defaultContainerField;
        this.methodName = methodName;
        this.methodType = methodType;
        this.ruleSource = ruleSource;
        this.notes = notes;
    }

    public String getParentNode() {
        return parentNode;
    }

    public String getChildNode() {
        return childNode;
    }

    public String getContainerField() {
        return containerField;
    }

    public boolean isDefaultContainerField() {
        return defaultContainerField;
    }

    public String getMethodName() {
        return methodName;
    }

    public MethodType getMethodType() {
        return methodType;
    }

    public RuleSource getRuleSource() {
        return ruleSource;
    }

    public String getNotes() {
        return notes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ParentChildEntry that = (ParentChildEntry) o;
        return Objects.equals(parentNode, that.parentNode) &&
                Objects.equals(childNode, that.childNode) &&
                Objects.equals(containerField, that.containerField) &&
                Objects.equals(methodName, that.methodName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(parentNode, childNode, containerField, methodName);
    }

    @Override
    public String toString() {
        return String.format("%s --[%s]-> %s => %s() [%s]",
                parentNode, containerField, childNode, methodName, ruleSource);
    }
}
