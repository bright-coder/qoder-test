import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  label: string;
  placeholder: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  style?: ViewStyle;
}

export const Select: React.FC<SelectProps> = ({
  label,
  placeholder,
  value,
  onValueChange,
  options,
  error,
  style,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={[{ marginBottom: theme.spacing[6] }, style]}>
      <Text style={{
        color: theme.colors.foreground,
        fontSize: theme.typography.sm,
        fontWeight: theme.typography.fontWeight.medium,
        marginBottom: theme.spacing[2],
        marginLeft: theme.spacing[1]
      }}>
        {label}
      </Text>
      
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderRadius: theme.borderRadius.md,
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[3],
          backgroundColor: theme.colors.background,
          borderColor: error 
            ? theme.colors.destructive 
            : theme.colors.border,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        onPress={() => setIsOpen(true)}
      >
        <Text style={{
          fontSize: theme.typography.sm,
          color: selectedOption 
            ? theme.colors.foreground 
            : theme.colors.mutedForeground,
        }}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={{
          fontSize: theme.typography.sm,
          color: theme.colors.mutedForeground,
        }}>
          ▼
        </Text>
      </TouchableOpacity>

      {error && (
        <View style={{ marginTop: theme.spacing[2] }}>
          <Text style={{
            color: theme.colors.destructive,
            fontSize: theme.typography.sm,
            marginLeft: theme.spacing[1],
            fontWeight: theme.typography.fontWeight.medium
          }}>
            {error}
          </Text>
        </View>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            paddingHorizontal: theme.spacing[4],
          }}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={{
            backgroundColor: theme.colors.card,
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            maxHeight: 300,
            ...theme.shadows.lg,
          }}>
            <View style={{
              padding: theme.spacing[4],
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            }}>
              <Text style={{
                fontSize: theme.typography.base,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.foreground,
              }}>
                {label}
              </Text>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    padding: theme.spacing[4],
                    borderBottomWidth: 1,
                    borderBottomColor: theme.colors.border,
                    backgroundColor: item.value === value 
                      ? theme.colors.accent 
                      : 'transparent',
                  }}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={{
                    fontSize: theme.typography.sm,
                    color: item.value === value 
                      ? theme.colors.accentForeground 
                      : theme.colors.foreground,
                    fontWeight: item.value === value 
                      ? theme.typography.fontWeight.medium 
                      : theme.typography.fontWeight.normal,
                  }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};