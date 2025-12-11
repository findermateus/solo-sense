<?php

namespace App\Application\DTOs;

use DateTime;
use JsonSerializable;

class HumidityDTO implements JsonSerializable
{
    private const HUMIDITY_STATUS = [
        'inAir' => [850, 1024],
        'drySoil' => [700, 850],
        'slightlyMoist' => [500, 700],
        'moist' => [300, 500],
        'waterSubmerged' => [0, 250],
    ];

    private string $analyzedAt;

    public function __construct(private float $value, ?DateTime $analyzedAt = null, private ?int $id = null)
    {
        $this->analyzedAt = $analyzedAt?->format('Y-m-d H:i:s') ?? (new DateTime())->format('Y-m-d H:i:s');
    }

    public static function fromArray(array $data): self
    {
        return new self(
            $data['value'] ?? null,
            isset($data['analyzed_at']) ? new DateTime($data['analyzed_at']) : null,
            $data['id'] ?? null
        );
    }

    public function getAnalyzedAt(): string
    {
        return $this->analyzedAt;
    }

    public function getValue(): float
    {
        return $this->value;
    }

    private function getHumidityStatus(): string
    {
        foreach (self::HUMIDITY_STATUS as $label => [$min, $max]) {
            if ($this->value >= $min && $this->value <= $max) {
                return $label;
            }
        }

        return 'unknown';
    }

    public function jsonSerialize(): mixed
    {
        return [
            'id' => $this->id,
            'status' => $this->getHumidityStatus(),
            'value' => $this->value,
            'analyzedAt' => $this->analyzedAt,
        ];
    }
}
